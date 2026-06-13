const extractedItems = [
    "Water utility information",
    "Contact number: (555) 123-4567",
    "Sewer: 555-987-6543",
    "Some random text here",
    "Town of Boston",
    "Call 1-800-555-0199 for town",
    "Gas",
    "National Grid (888) 123-4567",
    "Electric eversource",
    "800-592-2000"
];

const mockElements = {
    'ds_water': { options: [], value: '' },
    'ds_sewer': { options: [], value: '' },
    'ds_town': { options: [], value: '' },
    'ds_cable': { options: [], value: '' },
    'ds_telecom': { options: [], value: '' },
    'ds_gas': { options: [], value: '' },
    'ds_electric': { options: [], value: '' }
};

const document = {
    getElementById: (id) => {
        if (mockElements[id]) {
            const el = mockElements[id];
            el.add = function(option) {
                this.options.push(option);
            };
            return el;
        }
        return null;
    },
    createElement: (tag) => {
        return {};
    }
};

const phoneRegex = /(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
let lastSeenCategory = null;

extractedItems.forEach(item => {
    const lowerItem = item.toLowerCase();
    
    if (lowerItem.includes('water')) lastSeenCategory = 'ds_water';
    else if (lowerItem.includes('sewer')) lastSeenCategory = 'ds_sewer';
    else if (lowerItem.includes('town') || lowerItem.includes('city') || lowerItem.includes('municipality')) lastSeenCategory = 'ds_town';
    else if (lowerItem.includes('cable') || lowerItem.includes('comcast') || lowerItem.includes('spectrum')) lastSeenCategory = 'ds_cable';
    else if (lowerItem.includes('telecom') || lowerItem.includes('verizon') || lowerItem.includes('at&t') || lowerItem.includes('communication')) lastSeenCategory = 'ds_telecom';
    else if (lowerItem.includes('gas') || lowerItem.includes('national grid')) lastSeenCategory = 'ds_gas';
    else if (lowerItem.includes('electric') || lowerItem.includes('eversource') || lowerItem.includes('power')) lastSeenCategory = 'ds_electric';
    
    const match = item.match(phoneRegex);
    if (match && lastSeenCategory) {
        const phone = match[0];
        const selectElement = document.getElementById(lastSeenCategory);
        if (selectElement) {
            let optionExists = false;
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].value === phone) {
                    optionExists = true;
                    break;
                }
            }
            if (!optionExists) {
                const newOption = document.createElement('option');
                newOption.value = phone;
                newOption.text = phone;
                selectElement.add(newOption);
            }
            selectElement.value = phone;
        }
        lastSeenCategory = null; 
    }
});

console.log(JSON.stringify(mockElements, null, 2));
