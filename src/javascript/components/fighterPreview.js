import createElement from '../helpers/domHelper.js';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const fighterImage = createFighterImage(fighter);
        if (position === 'right') {
            fighterImage.style.transform = 'scale(-1, 1)';
        }

        fighterElement.append(fighterImage);

        const fighterInfoElements = Object.keys(fighter).filter(element => element !== '_id' && element !== 'source');

        fighterInfoElements.forEach(element => {
            const infoElement = createElement({ tagName: 'span', className: 'fighterInfo' });
            infoElement.innerText = `${element.toUpperCase()} : ${fighter[element]}`;
            fighterElement.append(infoElement);
        });
    }

    return fighterElement;
}
