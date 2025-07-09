// ==UserScript==
// @name         arknova.cards shortcut on BGA game table
// @namespace    https://gist.github.com/klingeling/309e65cd7828f9c2db0db7752f705dbb
// @author       klingeling
// @description  Add button for Ark Nova online game table on boardgamearena.com, which redirect to arknova.cards app with predefined filters based on base projects on active map
// @version      2025-07-09
// @match        https://boardgamearena.com/*/arknova*
// @updateURL    https://gist.github.com/klingeling/309e65cd7828f9c2db0db7752f705dbb/raw/arknova.cards.bga.shortcut.user.js
// @downloadURL  https://gist.github.com/klingeling/309e65cd7828f9c2db0db7752f705dbb/raw/arknova.cards.bga.shortcut.user.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const arkNovaGame = document.querySelector('#arknova-main-container');
        if (!arkNovaGame) return;

        const baseProjectsWrapper = document.querySelector('#base-projects-holder');
        const baseProjects = baseProjectsWrapper?.querySelectorAll('.project-holder');
        if (!baseProjectsWrapper || !baseProjects.length) return;

        const projectsMapID = {
            'Bird': 26,
            'Herbivore': 79,
            'Primate': 13,
            'Reptile': 28,
            'Predator': 54,
            'SeaAnimal': 58,
            'Africa': 29,
            'Americas': 69,
            'Asia': 86,
            'Australia': 41,
            'Europe': 78,
        };

        const dataTypesArray = Array.from(baseProjects).flatMap(project => Array.from(project.querySelectorAll('.project-card-slot .project-card-slot-cube-holder')).map(slot => slot.getAttribute('data-type')).filter(dataType => dataType && projectsMapID.hasOwnProperty(dataType)));
        console.log(`【klingeling】dataTypesArray: `, dataTypesArray)
        const uniqueMatchingValues = [...new Set(dataTypesArray.map(dataType => projectsMapID[dataType]))];
        if (!uniqueMatchingValues.length) return;

        const linkElement = document.createElement('a');
        Object.assign(linkElement, {
            href: `https://boardgame.915159.xyz/?id=${uniqueMatchingValues.join(',')}`,
            textContent: '在arknova.cards上检查基础项目卡牌',
            target: '_blank',
            style: "background-color: #528b43; color: #fff; padding: 5px 10px; margin-top: 11px; text-decoration: none; font-size: 13px; font-weight: 400;"
        });

        linkElement.addEventListener('mouseover', () => (linkElement.style.backgroundColor = '#4d7c0f'));
        linkElement.addEventListener('mouseout', () => (linkElement.style.backgroundColor = '#528b43'));
        baseProjectsWrapper.parentNode.insertBefore(linkElement, baseProjectsWrapper.nextSibling);

        function checkCardsOnHand() {
            const playerBoardHand = document.querySelector('.player-board-hand');
            const cardsOnHand = playerBoardHand.querySelectorAll('.ark-card');

            cardsOnHand.forEach(card => {
                card.querySelectorAll('.ark-default-project-badge').forEach(cardBadge => cardBadge.remove());
                const badgeIcons = card.querySelectorAll('.ark-card-top-right .badge-icon');

                badgeIcons.forEach(badgeIcon => {
                    const dataType = badgeIcon.getAttribute('data-type');

                    if (dataType && dataTypesArray.includes(dataType)) {
                        const arkCustomProjectBadge = document.createElement('div');
                        arkCustomProjectBadge.classList.add('ark-default-project-badge');

                        Object.assign(arkCustomProjectBadge, {
                            style: "position: absolute; top: 81px; width: 51px; height: 51px; border-radius: 50%; background: radial-gradient(circle, rgba(104,217,74,1) 50%, rgba(26,79,36,1) 100%); border: 2px solid #D9DDE8"
                        });

                        badgeIcon.appendChild(arkCustomProjectBadge);
                    }
                });
            });
        }

        checkCardsOnHand();

        const observer = new MutationObserver(checkCardsOnHand);
        observer.observe(document.querySelector('.player-board-hand'), { childList: true });
    });
})();