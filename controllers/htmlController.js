const Instruction = require('../models/instructionModel');
const Substance = require('../models/substanceModel');
const ImageCodes = require('../modules/imageCodes');
const { hazardCodes } = require('../modules/hazardCodes');

const getHomePage = async (req, res) => {
    try {
        res.render('home', { 
            title: 'Search hazardous materials', 
            layout: 'layouts/main'
        });
    } catch (error) {
        res.sendStatus(500);
    }
}

const getLoginPage = async (req, res) => {
    try {
        
        res.render('login', { 
            title: 'Login', 
            layout: 'layouts/main'
        });
    } catch (error) {
        res.sendStatus(500);
    }
}

const getLegalPage = async (req, res) => {
    try {
        res.render('legal', {
            title: 'Правна информация — Действие при инциденти с опасни товари',
            layout: 'layouts/main'
        });
    } catch (error) {
        res.sendStatus(500);
    }
}

const getDangerNumbersPage = async (req, res) => {
    try {
        const uniqueDangerNumbers = await Substance.distinct('dangerNumber', {
            dangerNumber: { $nin: [null, ''] }
        });

        const sortedDangerNumbers = uniqueDangerNumbers
            .map(number => number.toString().trim())
            .filter(number => number.length > 0)
            .sort((a, b) => a.localeCompare(b, 'bg', { numeric: true, sensitivity: 'base' }));

        const hazardCodeMap = new Map(
            hazardCodes.map(item => [item.number, item.description])
        );

        const substances = await Substance.find({
            dangerNumber: { $in: sortedDangerNumbers }
        })
            .populate('instruction', '_id number title description')
            .select('dangerNumber instruction')
            .lean();

        const instructionsByDangerCode = new Map();

        substances.forEach(substance => {
            const dangerNumber = (substance.dangerNumber || '').toString().trim();
            const instruction = substance.instruction;

            if (!dangerNumber || !instruction || !instruction._id) {
                return;
            }

            if (!instructionsByDangerCode.has(dangerNumber)) {
                instructionsByDangerCode.set(dangerNumber, new Map());
            }

            instructionsByDangerCode.get(dangerNumber).set(instruction._id.toString(), {
                id: instruction._id.toString(),
                number: instruction.number || '',
                title: instruction.title || '',
                description: instruction.description || ''
            });
        });

        const dangerCodes = sortedDangerNumbers.map(number => {
            const relatedInstructions = Array.from(
                (instructionsByDangerCode.get(number) || new Map()).values()
            ).sort((a, b) => {
                return a.number.localeCompare(b.number, 'bg', { numeric: true, sensitivity: 'base' });
            });

            return {
                number,
                description: hazardCodeMap.get(number) || 'Няма налично описание за този код.',
                instructions: relatedInstructions
            };
        });

        res.render('dangerNumbers', {
            title: 'Код на опасност',
            layout: 'layouts/main',
            dangerCodes
        });
    } catch (error) {
        res.sendStatus(500);
    }
}

const getPlatesPage = async (req, res) => {
    try {
        const substances = await Substance.find({})
            .populate('instruction', '_id number title description')
            .select('hazardClass hazardSubclass dangerNumber instruction')
            .lean();

        const uniqueImages = Array.from(new Set(ImageCodes.map(item => item.image)))
            .sort((a, b) => a.localeCompare(b, 'bg', { numeric: true, sensitivity: 'base' }));

        const plateMap = new Map(
            uniqueImages.map(image => [
                image,
                {
                    image,
                    dangerCodes: new Set(),
                    instructions: new Map(),
                    codeInstructions: new Map()
                }
            ])
        );

        const fillImages = (substance) => {
            const imgs = [];

            ImageCodes.forEach(code => {
                if (code.class === substance.hazardClass && code.class.length > 1) {
                    imgs.push(code.image);
                }

                if (code.class === substance.hazardClass && code.class.length === 1) {
                    const hazardSubclass = (substance.hazardSubclass || '').toString();
                    if (hazardSubclass.includes(code.subclass)) {
                        imgs.push(code.image);
                    }
                }
            });

            return Array.from(new Set(imgs));
        };

        substances.forEach(substance => {
            const images = fillImages(substance);

            images.forEach(image => {
                const plate = plateMap.get(image);
                if (!plate) {
                    return;
                }

                const dangerNumber = (substance.dangerNumber || '').toString().trim();
                if (dangerNumber) {
                    plate.dangerCodes.add(dangerNumber);
                    if (!plate.codeInstructions.has(dangerNumber)) {
                        plate.codeInstructions.set(dangerNumber, new Map());
                    }
                }

                const instruction = substance.instruction;
                if (instruction && instruction._id) {
                    const instructionId = instruction._id.toString();
                    const instructionItem = {
                        id: instructionId,
                        number: instruction.number || '',
                        title: instruction.title || ''
                    };

                    plate.instructions.set(instructionId, instructionItem);

                    if (dangerNumber) {
                        plate.codeInstructions.get(dangerNumber).set(instructionId, instructionItem);
                    }
                }
            });
        });

        const plates = Array.from(plateMap.values()).map(plate => {
            const dangerCodes = Array.from(plate.dangerCodes)
                .sort((a, b) => a.localeCompare(b, 'bg', { numeric: true, sensitivity: 'base' }));

            const instructions = Array.from(plate.instructions.values())
                .sort((a, b) => a.number.localeCompare(b.number, 'bg', { numeric: true, sensitivity: 'base' }));

            const codeInstructions = Array.from(plate.codeInstructions.entries())
                .map(([code, instructionMap]) => {
                    const codeInstructionItems = Array.from(instructionMap.values())
                        .sort((a, b) => a.number.localeCompare(b.number, 'bg', { numeric: true, sensitivity: 'base' }));

                    return {
                        code,
                        instructions: codeInstructionItems
                    };
                })
                .sort((a, b) => a.code.localeCompare(b.code, 'bg', { numeric: true, sensitivity: 'base' }));

            return {
                image: plate.image,
                dangerCodes,
                instructions,
                codeInstructions
            };
        });

        res.render('plates', {
            title: 'Табели',
            layout: 'layouts/main',
            plates
        });
    } catch (error) {
        res.sendStatus(500);
    }
}

const getPublicInstructionPage = async (req, res) => {
    try {
        const instruction = await Instruction.findOne({ _id: req.params.id });

        if (!instruction) {
            return res.status(404).render('404', {
                title: 'Действие при инциденти с опасни товари',
                url: req.originalUrl,
                layout: 'layouts/main'
            });
        }

        res.render('showInstructionPublic', {
            title: `Инструкция ${instruction.number}`,
            instruction,
            layout: 'layouts/main'
        });
    } catch (error) {
        res.sendStatus(500);
    }
}

const getDashboardPage = async (req, res) => {
    try {
        res.render('dashboard', { title: 'ADMIN', layout: 'layouts/admin'});
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getDataPage = async (req, res) => {
    try {   
        const substances = await Substance.find({});
        const instructions = await Instruction.find({});
        
        res.render('exportData', { 
            title: 'ADMIN', 
            layout: 'layouts/admin', 
            substances: btoa(encodeURI(JSON.stringify(substances))),
            instructions: btoa(encodeURI(JSON.stringify(instructions)))
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getListInstructionsPage = async (req, res) => {
    try {
        let instructions = await Instruction.find({}, { _id: 1, number: 1, title: 1, description: 1 }).sort({ number: 1 });
        if (!instructions) {
            instructions = [];
        }        
        res.render('listInstructions', { title: 'ADR app', instructions: instructions, layout: 'layouts/admin' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

const getAddInstructionPage = async (req, res) => {
    try {
        res.render('addInstruction', { 
            title: 'ADR app', 
            layout: 'layouts/admin' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getEditInstructionPage = async (req, res) => {
    try {
        let instruction = await Instruction.findOne({_id: req.params.id });
            
        res.render('editInstruction', { 
            title: 'ADR app', 
            instruction: instruction, 
            layout: 'layouts/admin' });

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getShowInstructionPage = async (req, res) => {
    try {
        let instruction = await Instruction.findOne({_id: req.params.id });
            
        res.render('showInstruction', { 
            title: 'ADR app', 
            instruction: instruction, 
            layout: 'layouts/admin' });

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getDeleteInstructionPage = async (req, res) => {
    try {
        let result = await Instruction.deleteOne({_id: req.params.id });

        if(result.deletedCount === 0) {
            return res.status(404).send('Instruction not found');
        }

        res.redirect('/admin/instructions/');

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getListSubstancePage = async (req, res) => {
    try {
        let substances = await Substance.find({}).sort({ unNumber: 1 });

        if (!substances) {
            substances = [];
        }        
        res.render('listSubstances', { title: 'ADR app', substances: substances, layout: 'layouts/admin' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}


const getEditSubstancePage = async (req, res) => {
    try {
        let substance = await Substance.findOne({_id: req.params.id }).populate('instruction');
        
        res.render('editSubstance', { 
            title: 'ADR app', 
            substance: substance, 
            layout: 'layouts/admin' });

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getShowSubstancePage = async (req, res) => {
    try {
        let substance = await Substance.findOne({_id: req.params.id }).populate('instruction');
        
        if(substance) {
            let imgs = [];
            fillImages(imgs, substance);
            
            res.render('showSubstance', { 
                title: 'ADR app', 
                substance: substance, 
                images: imgs,
                layout: 'layouts/admin' });
        }

    } catch (error) {
        res.status(500).send('Server Error');
    }

    function fillImages(imgs, substance) {
        ImageCodes.forEach(code => {
            if(code.class === substance.hazardClass && code.class.length > 1) {
                imgs.push(code.image)
            }

            if(code.class === substance.hazardClass && code.class.length === 1) {
                if(substance.hazardSubclass.includes(code.subclass)){
                    imgs.push(code.image)
                }
            }
        });
    }
}

const getDeleteSubstancePage = async (req, res) => {
    try {
        let result = await Substance.deleteOne({_id: req.params.id });

        if(result.deletedCount === 0) {
            return res.status(404).send('Substance not found');
        }

        res.redirect('/admin/substancess/');

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getLegalPage,
    getHomePage,
    getLoginPage,
    getDangerNumbersPage,
    getPlatesPage,
    getPublicInstructionPage,
    getDashboardPage,
    getDataPage,
    getListInstructionsPage,
    getAddInstructionPage,
    getEditInstructionPage,
    getShowInstructionPage,
    getDeleteInstructionPage,
    getListSubstancePage,
    getEditSubstancePage,
    getShowSubstancePage,
    getDeleteSubstancePage
}