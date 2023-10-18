import controls from '../../constants/controls.js';

function isCriticalKick(combination, pressedKey) {
    return combination.every(key => pressedKey.has(key));
}

export function getHitPower(fighter) {
    return fighter.attack * (Math.random() + 1);
}

export function getBlockPower(fighter) {
    return fighter.defense * (Math.random() + 1);
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage < 0 ? 0 : damage;
}

/* eslint-disable no-param-reassign */
export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        firstFighter.criticalKick = false;
        secondFighter.criticalKick = false;
        firstFighter.healthPoints = firstFighter.health;
        secondFighter.healthPoints = secondFighter.health;
        const firstFighterHealthIndicator = document.getElementById('left-fighter-indicator');
        const secondFighterHealthIndicator = document.getElementById('right-fighter-indicator');
        const pressedKey = new Set();

        function criticalKick(attacker, defender, indicator) {
            if (!attacker.criticalKick) {
                defender.healthPoints -= attacker.attack * 2;
                indicator.style.width =
                    defender.healthPoints <= 0 ? '0%' : `${(defender.healthPoints * 100) / defender.health}%`;
                attacker.criticalKick = true;

                setTimeout(() => {
                    attacker.criticalKick = false;
                }, 10000);
            }

            if (defender.healthPoints <= 0) {
                return resolve(attacker);
            }

            return null;
        }

        document.addEventListener('keydown', event => {
            pressedKey.add(event.code);

            switch (event.code) {
                case controls.PlayerOneBlock:
                    firstFighter.blocking = true;
                    break;
                case controls.PlayerTwoBlock:
                    secondFighter.blocking = true;
                    break;
                default:
                    if (isCriticalKick(controls.PlayerOneCriticalHitCombination, pressedKey)) {
                        criticalKick(firstFighter, secondFighter, secondFighterHealthIndicator);
                    }
                    if (isCriticalKick(controls.PlayerTwoCriticalHitCombination, pressedKey)) {
                        criticalKick(secondFighter, firstFighter, firstFighterHealthIndicator);
                    }
                    break;
            }
        });

        function kick(attacker, defender, indicator) {
            defender.healthPoints -= getDamage(attacker, defender);
            indicator.style.width =
                defender.healthPoints <= 0 ? '0%' : `${(defender.healthPoints * 100) / defender.health}%`;
            if (defender.healthPoints <= 0) resolve(attacker);
        }

        document.addEventListener('keyup', event => {
            pressedKey.clear();

            switch (event.code) {
                case controls.PlayerOneAttack:
                    if (!secondFighter.blocking && !firstFighter.blocking) {
                        kick(firstFighter, secondFighter, secondFighterHealthIndicator);
                    }
                    break;
                case controls.PlayerOneBlock:
                    firstFighter.blocking = false;
                    break;
                case controls.PlayerTwoAttack:
                    if (!firstFighter.blocking && !secondFighter.blocking) {
                        kick(secondFighter, firstFighter, firstFighterHealthIndicator);
                    }
                    break;
                case controls.PlayerTwoBlock:
                    secondFighter.blocking = false;
                    break;
                default:
                    break;
            }
        });
    });
}
