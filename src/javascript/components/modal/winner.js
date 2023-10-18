import showModal from './modal.js';
import createElement from '../../helpers/domHelper.js';

export default function showWinnerModal(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };

    const bodyElement = createElement({
        tagName: 'img',
        className: 'modal-body',
        attributes
    });

    const title = `${fighter.name.toUpperCase()} WIN!`;

    showModal({ title, bodyElement });
}
