// ==UserScript==
// @name [Steam] Monster MiniGame Auto Play Script
// @author Js41637
// @description A script that runs the Steam Monster Minigame for you.
// @version 1.1
// @match http://steamcommunity.com/minigame/towerattack*
// ==/UserScript==

var isAlreadyRunning = false;
var clickRate = 25;

var ABILITIES = {
	"MORALE_BOOSTER": 5,
	"GOOD_LUCK": 6,
	"MEDIC": 7,
	"METAL_DETECTOR": 8,
	"COOLDOWN": 9,
	"NUKE": 10,
	"CLUSTER_BOMB": 11,
	"NAPALM": 12
};

var ITEMS = {
	"REVIVE": 13,
	"GOLD_RAIN": 17,
	"GOD_MODE": 21,
	"REFLECT_DAMAGE":24,
	"CRIT": 18,
	"CRIPPLE_MONSTER": 15,
	"CRIPPLE_SPAWNER": 14,
	"MAXIMIZE_ELEMENT": 16
};

var ENEMY_TYPE = {
	"SPAWNER":0,
	"CREEP":1,
	"BOSS":2,
	"MINIBOSS":3,
	"TREASURE":4
};

if (window.CEnemy !== undefined)
{
	window.CEnemy.prototype.TakeDamage = function(){};
	window.CEnemySpawner.prototype.TakeDamage = function(){};
	window.CEnemyBoss.prototype.TakeDamage = function(){};
}

var targetFound = false,
	highestHP = 0,
	lowestHP = 0,
	targetLane = 0,
	targetEnemy = 0,
	preferredLane = -1,
	preferredTarget = -1,
	lowPercentageHP = 0,
	lowHPThreshold = 0.1,
	stacksActive = false;

function doTheThing() {
	if (isAlreadyRunning || g_Minigame === undefined || g_Minigame.m_CurrentScene === undefined || !g_Minigame.m_CurrentScene.m_bRunning || !g_Minigame.m_CurrentScene.m_rgPlayerTechTree) {
		return;
	}
	isAlreadyRunning = true;

	g_msTickRate = 1100;

	goToLaneWithBestTarget();
	useMedicsIfRelevant();
	attemptRespawn();

	isAlreadyRunning = false;
}

function CheckRainGold() {
	if(targetEnemy != ENEMY_TYPE.TREASURE && targetEnemy != ENEMY_TYPE.BOSS ){
		var potential = 0,
			count = 0;
		for (var iLane = 0; iLane < g_Minigame.CurrentScene().m_rgGameData.lanes.length; iLane++) {
			var stacks = 0;
			// Check if Rain Gold Stack is active
			if (g_Minigame.m_CurrentScene.m_rgLaneData[iLane].abilities[17] !== undefined && g_Minigame.CurrentScene().m_rgGameData.lanes[iLane].dps !== 0) {
				stacks = g_Minigame.m_CurrentScene.m_rgLaneData[iLane].abilities[17];
				console.info("Found lane with Raining Gold", iLane, stacks);
				// Find enemy with highest gold * stacks value and set it as preferred target
				for (var iEnemy = 0; iEnemy < g_Minigame.m_CurrentScene.m_rgEnemies.length; iEnemy++) {
					var enemyGold = g_Minigame.m_CurrentScene.m_rgEnemies[iEnemy].m_data.gold;
					if (stacks * enemyGold > potential) {
                		potential = stacks * enemyGold;
						preferredTarget = g_Minigame.m_CurrentScene.m_rgEnemies[iEnemy].m_nID;
						preferredLane = iLane;
						console.info("Found Prefered stacks target! Lane:", iLane);
    				}
    			}
			} else {
				count += 1;
			}
		}
		// If count == 3 means all lanes reported no stacks so disable it
		if (count === 3) {
			console.info("No stacks found in any lanes");
			preferredTarget = -1;
			preferredLane = -1;
			stacksActive = false;
		}
	}
}

function goToLaneWithBestTarget() {
	console.info("~-.-~-.-~-.-~-.-~-.-~-.-~-.-~-.-~-.-~");

	var enemies={0:[],1:[],2:[],3:[],4:[]};
	// Fetch and store all the enemies on the page
	for (var iLane = 0; iLane < 3; iLane++) {
		for (var iEnemy = 0; iEnemy < 4; iEnemy++) {
			var enemy = g_Minigame.CurrentScene().GetEnemy(iLane, iEnemy);
			if (enemy) {
				enemies[enemy.m_data.type].push(enemy);
			}
		}
	}

	CheckRainGold();

	//If Stacks is active do its thing else contine
	if (stacksActive && preferredLane != -1 && preferredTarget != -1) {
		targetLane = preferredLane;
		targetEnemy = preferredTarget;
		targetFound = true;
		console.info('Switching to a lane with best raining gold benefit');
	} else {
		// Check if its currently a Boss Level
		if (enemies[ENEMY_TYPE.BOSS][0] !== undefined || enemies[ENEMY_TYPE.MINIBOSS][0] !== undefined) {
			console.info("Boss level detected, switching to");
			// If Boss is alive, target it
			if (enemies[ENEMY_TYPE.BOSS][0] !== undefined) {
				console.info('Boss detected, switching to');
				targetLane = enemies[ENEMY_TYPE.BOSS][0].m_nLane;
				targetEnemy = enemies[ENEMY_TYPE.BOSS][0].m_nID;
			// If the boss is dead target the MiniBosses
			} else if (enemies[ENEMY_TYPE.MINIBOSS][0] !== undefined) {
				console.info('MiniBoss detected, switching to');
				targetLane = enemies[ENEMY_TYPE.MINIBOSS][0].m_nLane;
				targetEnemy = enemies[ENEMY_TYPE.MINIBOSS][0].m_nID;
			}
		} else {
			console.info('No boss');
			// Target any spawner first, doesn't really matter what one;
			if (enemies[ENEMY_TYPE.SPAWNER][0] !== undefined) {
				console.info('Spawner detected, switching to', enemies[ENEMY_TYPE.SPAWNER][0]);
				targetLane = enemies[ENEMY_TYPE.SPAWNER][0].m_nLane;
				targetEnemy = enemies[ENEMY_TYPE.SPAWNER][0].m_nID;
			// If there is no spawners target Creep with lowest health
			} else {
				console.info('No spawner detected, finding Creep with lowest health');
				var lowestHealth = 0;
				var lowestHealthEnemy = null;
				for (var iCreep = 0; iCreep < enemies[ENEMY_TYPE.CREEP].length; iCreep++) {
					if (!enemies[ENEMY_TYPE.CREEP][iCreep].m_bIsDestroyed && (enemies[ENEMY_TYPE.CREEP][iCreep].m_flDisplayedHP < lowestHealth || lowestHealth < 1)) {
						lowestHealth = enemies[ENEMY_TYPE.CREEP][iCreep].m_flDisplayedHP;
						lowestHealthEnemy = enemies[ENEMY_TYPE.CREEP][iCreep];
					}
				}
				console.info("Found Creep", lowestHealthEnemy);
				if (lowestHealthEnemy !== null) {
					targetLane = lowestHealthEnemy.m_nLane;
					targetEnemy = lowestHealthEnemy.m_nID;
				}
			}
		}
		targetFound = true;
	}

	// Switch to the chosen lane and target
	if (targetFound) {
		// Switch to chose lane if it isn't already active
		if (g_Minigame.CurrentScene().m_nExpectedLane != targetLane) {
			console.info('switching lanes');
			g_Minigame.CurrentScene().TryChangeLane(targetLane);
		}

		// Target chosen even if it isn't already selected
		if (g_Minigame.CurrentScene().m_nTarget != targetEnemy) {
			console.info('switching targets');
			g_Minigame.CurrentScene().TryChangeTarget(targetEnemy);
		}
	}
}

function useMedicsIfRelevant() {
	var myMaxHealth = g_Minigame.CurrentScene().m_rgPlayerTechTree.max_hp;

	// check if health is below 50%
	var hpPercent = g_Minigame.CurrentScene().m_rgPlayerData.hp / myMaxHealth;
	if (hpPercent > 0.5 || g_Minigame.CurrentScene().m_rgPlayerData.hp < 1) {
		return; // no need to heal - HP is above 50% or already dead
	}

	// check if Medics is purchased and cooled down
	if (hasPurchasedAbility(ABILITIES.MEDIC) && !isAbilityCoolingDown(ABILITIES.MEDIC)) {

		// Medics is purchased, cooled down, and needed. Trigger it.
		//console.log('Medics is purchased, cooled down, and needed. Trigger it.');
		triggerAbility(ABILITIES.MEDIC);
	} else if (hasItem(ITEMS.GOD_MODE) && !isAbilityCoolingDown(ITEMS.GOD_MODE)) {

		//console.log('We have god mode, cooled down, and needed. Trigger it.');
		triggerItem(ITEMS.GOD_MODE);
	}
}

//If player is dead, call respawn method
function attemptRespawn() {
	if ((g_Minigame.CurrentScene().m_bIsDead) &&
			((g_Minigame.CurrentScene().m_rgPlayerData.time_died * 1000) + 5000) < (new Date().getTime())) {
		RespawnPlayer();
	}
}

function hasItem(itemId) {
	for ( var i = 0; i < g_Minigame.CurrentScene().m_rgPlayerTechTree.ability_items.length; ++i ) {
		var abilityItem = g_Minigame.CurrentScene().m_rgPlayerTechTree.ability_items[i];
		if (abilityItem.ability == itemId) {
			return true;
		}
	}
	return false;
}

function isAbilityCoolingDown(abilityId) {
	return g_Minigame.CurrentScene().GetCooldownForAbility(abilityId) > 0;
}

function hasPurchasedAbility(abilityId) {
	// each bit in unlocked_abilities_bitfield corresponds to an ability.
	// the above condition checks if the ability's bit is set or cleared. I.e. it checks if
	// the player has purchased the specified ability.
	return (1 << abilityId) & g_Minigame.CurrentScene().m_rgPlayerTechTree.unlocked_abilities_bitfield;
}

function triggerItem(itemId) {
	var elem = document.getElementById('abilityitem_' + itemId);
	if (elem && elem.childElements() && elem.childElements().length >= 1) {
		g_Minigame.CurrentScene().TryAbility(document.getElementById('abilityitem_' + itemId).childElements()[0]);
	}
}

function triggerAbility(abilityId) {
	g_Minigame.CurrentScene().m_rgAbilityQueue.push({'ability': abilityId});
}
function start() {
	if (thingTimer !== undefined) {
		window.clearTimeout(thingTimer);
	}
	var thingTimer = window.setInterval(doTheThing, 1500);
	var clickTimer = window.setInterval(clickTheThing, 1000/clickRate);

	setTimeout(function() {
		g_Minigame.CurrentScene().SpawnEmitter = function(emitter) {
			emitter.emit = false;
			return emitter;
		};
	}, 1000);

}

function clickTheThing() {
    g_Minigame.m_CurrentScene.DoClick(
        {
            data: {
                getLocalPosition: function() {
                    var enemy = g_Minigame.m_CurrentScene.GetEnemy(
                                      g_Minigame.m_CurrentScene.m_rgPlayerData.current_lane,
                                      g_Minigame.m_CurrentScene.m_rgPlayerData.target),
                        laneOffset = enemy.m_nLane * 440;

                    return {
                        x: enemy.m_Sprite.position.x - laneOffset,
                        y: enemy.m_Sprite.position.y - 52
                    };
                }
            }
        }
    );
}

// Delay to start the script;
setTimeout(function(){ start(); }, 3500);
