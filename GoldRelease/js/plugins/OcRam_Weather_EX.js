//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Core.js        (will be embedded in all of my plugins)
//=============================================================================
/* DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS SOFTWARE AS YOUR OWN!     *
 * Copyright(c) 2020, Marko Paakkunainen // mmp_81 (at) hotmail.com         */
"use strict"; var ShaderTilemap = ShaderTilemap || false; var Imported = Imported || {}; var Yanfly = Yanfly || {}; // In case there's no Yanfly plugins in use
if (!Imported.OcRam_Core) { // OcRam_Core has only the functionality which are used widely in all OcRam plugins...
    Game_Interpreter.prototype.event = function () { /* Get Game_Event in event editor like: this.event(); */ return ($gameMap) ? $gameMap.event(this._eventId) : null; };
    Game_Map.prototype.getEventsByName = function (event_name) { /* Get Game_Map events by name */ return this._events.filter(function (ev) { return ev.event().name == event_name; }); };
    Game_Event.prototype.getComments = function () { /* Returns all comments + commandIndex from Game_Event as Array */ if (this._erased || this._pageIndex < 0) return []; var comments = []; var i = 0; this.list().forEach(function (p) { if (p.code == 108) { p.commandIndex = i; comments.push(p); } i++; }); return comments; };
    Game_Event.prototype.getStringComments = function () { /* Returns all comments from Game_Event as String Array */ if (this._erased || this._pageIndex < 0) return []; var comments = []; this.list().filter(function (c) { return c.code == 108; }).forEach(function (p) { p.parameters.forEach(function (s) { comments.push(s); }); }); return comments; };
    ImageManager.loadOcRamBitmap = function (filename, hue) {  /* Load bitmap from ./img/ocram folder */ return this.loadBitmap('img/ocram/', filename, hue, false); };
    Imported.OcRam_Core = true; var OcRam_Core = OcRam_Core || function () { /* OcRam core class */ this.initialize.apply(this, arguments); };
    OcRam_Core.prototype.initialize = function () { /* Initialize OcRam core */ this.name = "OcRam_Core"; this.version = "1.05"; this.twh = [48, 48]; this.twh50 = [24, 24]; this.radian = Math.PI / 180; this._isIndoors = false; this._screenTWidth = Graphics.width / 48; this._screenTHeight = Graphics.height / 48; this.plugins = []; this._menuCalled = false; this.Scene_Map_callMenu = Scene_Map.prototype.callMenu; this.Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded; };
    OcRam_Core.prototype.debug = function () { /* Debug core? console.log("OcRam_Core", arguments); */ };
    OcRam_Core.prototype.getBoolean = function (s) { /* Get 'safe' boolean */ if (!s) return false; s = s.toString().toLowerCase(); return (s == "true" && s != "0") ? true : false; };
    OcRam_Core.prototype.getArray = function (a, b) { /* Get plugin param array */ return a ? eval(a) : b || []; };
    OcRam_Core.prototype.getFloat = function (n) { /* Get float */ return isNaN(n - parseFloat(n)) ? 0 : parseFloat(n); };
    OcRam_Core.prototype.regulateRGBG = function (obj) { /* Regulate RGBG value (used in tints) */ obj.Red = parseInt(obj.Red).clamp(-255, 255); obj.Green = parseInt(obj.Green).clamp(-255, 255); obj.Blue = parseInt(obj.Blue).clamp(-255, 255); obj.Gray = parseInt(obj.Gray).clamp(-255, 255); return obj; };
    OcRam_Core.prototype.regulateHexRGBA = function (p) { /* Regulate HEX RGBA value */ if (p.substr(0, 1) !== "#") p = "#" + p; if (p.length == 7) p = p + "ff"; return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(p)[0] || "#ffffffff"; }
    OcRam_Core.prototype.getJSON = function (s) { /* Get 'safe' JSON */ try { return JSON.parse(s); } catch (ex) { return null; } };
    OcRam_Core.prototype.getJSONArray = function (a) { /* Get 'safe' JSON Array */ var tmp = []; if (a) { OcRam.getArray(a, []).forEach(function (s) { tmp.push(OcRam.getJSON(s)); }); } return tmp; };
    OcRam_Core.prototype.followers = function () { /* Only a shortcut to $gamePlayer._followers.visibleFollowers(); */ return $gamePlayer ? $gamePlayer._followers.visibleFollowers() : []; };
    OcRam_Core.prototype.setIndoorsFlag = function () { /* Set indoors flag - Each plugin will call this when needed */ if (DataManager.isEventTest()) return; if ($dataMap.meta["indoors"] !== undefined) { this.debug("Indoors meta tag found in MAP note field!", $dataMap.meta); this._isIndoors = true; } else { if ($dataTilesets[$dataMap.tilesetId].meta["indoors"] !== undefined) { this.debug("Indoors meta tag found in TILESET note field!", $dataTilesets[$dataMap.tilesetId].meta); this._isIndoors = true; } else { this.debug("Indoors meta tag was NOT found!", undefined); this._isIndoors = false; } } };
    OcRam_Core.prototype.isIndoors = function () { /* Get indoors flag */ return this._isIndoors; };
    OcRam_Core.prototype.runCE = function (pCE_Id) { /* Run common event */ if ($gameTemp.isCommonEventReserved()) { var tmpId = pCE_Id; var tc = this; setTimeout(function () { tc.runCE(tmpId); }, 17); } else { $gameTemp.reserveCommonEvent(pCE_Id); } };
    OcRam_Core.prototype.extendMethod = function (c, b, cb) { /* Extend/override any method */ c[b] = function () { return cb.apply(this, arguments); }; };
    OcRam_Core.prototype.extendProto = function (c, b, cb) { /* Extend/override any proto */ c.prototype[b] = function () { return cb.apply(this, arguments); }; };
    OcRam_Core.prototype.addPlugin = function (name, version) { /* Initialize new OcRam plugin */ this[name] = {}; var new_plugin = this[name]; Imported["OcRam_" + name] = true; this.plugins.push(name); this[name]._menuCalled = false; new_plugin.name = name; new_plugin.version = version; new_plugin.parameters = PluginManager.parameters("OcRam_" + new_plugin.name); if (this.getBoolean(new_plugin.parameters["Debug mode"])) { new_plugin.debug = function () { var args = [].slice.call(arguments); args.unshift("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", ":"); console.log.apply(console, args); }; console.log("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", "Debug mode:", "Enabled"); console.log("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", "Parameters:", new_plugin.parameters); } else { new_plugin.debug = function () { }; } var oc = this; new_plugin.extend = function (c, b, cb) { var cb_name = c.name + "_" + b; if (c[b]) { this[cb_name] = c[b]; oc.extendMethod(c, b, cb); } else { this[cb_name] = c.prototype[b]; oc.extendProto(c, b, cb); } }; }; var OcRam = new OcRam_Core(); // Create new OcRam_Core! (Below aliases)
    Scene_Map.prototype.callMenu = function () { /* Menu called? */ OcRam.Scene_Map_callMenu.call(this); OcRam.debug("Menu called:", true); OcRam._menuCalled = true; OcRam.plugins.forEach(function (p) { OcRam[p]._menuCalled = true; }); };
    Scene_Map.prototype.onMapLoaded = function () { /* Set and get tile dimensions and indoors flag */ OcRam.Scene_Map_onMapLoaded.call(this); if (!OcRam._menuCalled) { OcRam.twh = [$gameMap.tileWidth(), $gameMap.tileHeight()]; OcRam.twh50 = [OcRam.twh[0] * 0.5, OcRam.twh[1] * 0.5]; OcRam._screenTWidth = Graphics.width / OcRam.twh[0]; OcRam._screenTHeight = Graphics.height / OcRam.twh[1]; OcRam.debug("Tile w/h:", OcRam.twh); OcRam.setIndoorsFlag(); OcRam.menuCalled = false; } };
    CanvasRenderingContext2D.prototype.line = function (x1, y1, x2, y2) { /* Draw line to canvas context */ this.beginPath(); this.moveTo(x1, y1); this.lineTo(x2, y2); this.stroke(); };
    Game_Map.prototype.adjustX_OC = function (x) { /* Optimized core adjustX */ if (this.isLoopHorizontal()) { if (x < this._displayX - (this.width() - this.screenTileX()) * 0.5) { return x - this._displayX + $dataMap.width; } else { return x - this._displayX; } } else { return x - this._displayX; } };
    Game_Map.prototype.adjustY_OC = function (y) { /* Optimized core adjustY */ if (this.isLoopVertical()) { if (y < this._displayY - (this.height() - this.screenTileY()) * 0.5) { return y - this._displayY + $dataMap.height; } else { return y - this._displayY; } } else { return y - this._displayY; } };
    Game_CharacterBase.prototype.screenX_OC = function () { /* Optimized core screenX */ return Math.round($gameMap.adjustX_OC(this._realX) * OcRam.twh[0] + OcRam.twh50[0]); };
    Game_CharacterBase.prototype.screenY_OC = function () { /* Optimized core screenY */ return Math.round($gameMap.adjustY_OC(this._realY) * OcRam.twh[1] + OcRam.twh50[0] - this.shiftY() - this.jumpHeight()); };
} if (parseFloat(OcRam.version) < 1.05) alert("OcRam core v1.05 is required!");

//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Weather_EX.js
//=============================================================================

"use strict"; if (!Imported || !Imported.OcRam_Core) alert('OcRam_Core.js ' +
    'is required!'); OcRam.addPlugin("Weather_EX", "2.12");

/*:
 * @plugindesc v2.12 Weather Extensions to default weather system.
 * PLUGIN NAME MUST BE OcRam_Weather_EX.js
 * @author OcRam
 *
 * @param Use enhanced weather
 * @type boolean
 * @desc Do you want OcRam tuned weather effects?
 * (for built-in weather types: rain/storm/snow)
 * @default true
 *
 * @param Max weather sprites
 * @parent Use enhanced weather
 * @type number
 * @min 10
 * @max 80
 * @desc Adjusts the maximum weather sprite multiplier (enhanced weather). More sprites needs more computing...
 * @default 40
 *
 * @param Use dynamic weather
 * @type boolean
 * @desc Do you want to automate weather system? (Requires meta
 * data from tileset/map and pools/weathers to be configured)
 * @default true
 *
 * @param Clear instructions
 * @parent Use dynamic weather
 * @type text[]
 * @desc Use to clear any supportive weather effects set by plugin commands.
 * @default []
 *
 * @param Indoors instructions
 * @parent Use dynamic weather
 * @type text[]
 * @desc Use to hide any supportive weather effects in indoor maps.
 * @default []
 *
 * @param Weather pools
 * @parent Use dynamic weather
 * @type struct<WeatherPools>[]
 * @desc Weather pools for automatic weather effects.
 * @default ["{\"Id\":\"1\",\"Name\":\"Spring\",\"PowerBoost\":\"0\",\"MinClearTime\":\"30\",\"MaxClearTime\":\"300\",\"ClearChance\":\"50\",\"ProbableWeatherIds\":\"[\\\"0\\\"]\",\"ProbableBonus\":\"25\",\"ImprobableWeatherIds\":\"[\\\"0\\\"]\",\"ImprobablePenalty\":\"25\"}","{\"Id\":\"2\",\"Name\":\"Summer\",\"PowerBoost\":\"0\",\"MinClearTime\":\"30\",\"MaxClearTime\":\"300\",\"ClearChance\":\"50\",\"ProbableWeatherIds\":\"[\\\"0\\\"]\",\"ProbableBonus\":\"25\",\"ImprobableWeatherIds\":\"[\\\"0\\\"]\",\"ImprobablePenalty\":\"25\"}","{\"Id\":\"3\",\"Name\":\"Autumn\",\"PowerBoost\":\"1\",\"MinClearTime\":\"30\",\"MaxClearTime\":\"300\",\"ClearChance\":\"40\",\"ProbableWeatherIds\":\"[\\\"1\\\",\\\"2\\\"]\",\"ProbableBonus\":\"25\",\"ImprobableWeatherIds\":\"[]\",\"ImprobablePenalty\":\"25\"}","{\"Id\":\"4\",\"Name\":\"Winter\",\"PowerBoost\":\"0\",\"MinClearTime\":\"30\",\"MaxClearTime\":\"300\",\"ClearChance\":\"50\",\"ProbableWeatherIds\":\"[\\\"0\\\"]\",\"ProbableBonus\":\"25\",\"ImprobableWeatherIds\":\"[\\\"0\\\"]\",\"ImprobablePenalty\":\"25\"}"]
 *
 * @param Weathers
 * @parent Use dynamic weather
 * @type struct<Weather>[]
 * @desc All possible weathers.
 * @default ["{\"Id\":\"1\",\"Name\":\"Rain\",\"Type\":\"1\",\"PossiblePoolIds\":\"[\\\"1\\\",\\\"2\\\",\\\"3\\\"]\",\"PluginCommands\":\"[]\",\"WeatherBGS1\":\"\",\"WeatherBGS2\":\"\",\"MinDuration\":\"60\",\"MaxDuration\":\"480\"}","{\"Id\":\"2\",\"Name\":\"Storm\",\"Type\":\"2\",\"PossiblePoolIds\":\"[\\\"1\\\", \\\"2\\\", \\\"3\\\"]\",\"PluginCommands\":\"[]\",\"WeatherBGS1\":\"\",\"WeatherBGS2\":\"\",\"MinDuration\":\"30\",\"MaxDuration\":\"480\"}","{\"Id\":\"3\",\"Name\":\"Snow\",\"Type\":\"3\",\"PossiblePoolIds\":\"[\\\"4\\\"]\",\"PluginCommands\":\"[]\",\"WeatherBGS1\":\"\",\"WeatherBGS2\":\"\",\"MinDuration\":\"60\",\"MaxDuration\":\"480\"}"]
 *
 * @param Min storm power
 * @type number
 * @desc Adjusts the minimum 'storm' power where lightnings appear.
 * 0 = Always on.
 * Default: 4
 * @default 4
 * 
 * @param Lightning wait
 * @parent Min storm power
 * @type number
 * @desc Adjusts the minimum time next lightning can appear.
 * 0 = No lightnings
 * Default: 4
 * @default 4
 * 
 * @param Lightning frequency
 * @parent Min storm power
 * @type number
 * @desc Adjusts the BASE frequency of lightnings.
 * Percent chance per second with storm power 5.
 * 0 = No lightnings
 * Default: 10
 * @default 10
 *
 * @param Lightning variation
 * @parent Min storm power
 * @type number
 * @decimals 2
 * @desc Adjusts the thunder power variation (volume and pan).
 * 0 = No variation at all, 1 = Mute
 * Default: 0.25
 * @default 0.25
 * 
 * @param Thunder SE
 * @parent Min storm power
 * @type file
 * @dir audio/se
 * @desc Thunder sound effect. (Leave empty to have no SE)
 * @default Thunder9
 *
 * @param Storm BGS
 * @parent Min storm power
 * @type file
 * @dir audio/bgs
 * @desc Storm background sound. (Leave empty to have no BGS)
 * @default Storm2
 * 
 * @param Lightning CE
 * @parent Min storm power
 * @type common_event
 * @desc Run run this event when ever lightning strikes!
 * @default 0
 *
 * @param Min blizzard power
 * @type number
 * @desc Adjusts the minimum 'snow' power where it comes to blizzard.
 * Default: 5
 * @default 5
 *
 * @param Blizzard BGS
 * @parent Min blizzard power
 * @type file
 * @dir audio/bgs
 * @desc Blizzard background sound. (Leave empty to have no BGS)
 * @default Wind
 *
 * @param Min pouring power
 * @type number
 * @desc Adjusts the minimum 'rain' power when it's 'pouring'.
 * Default: 5
 * @default 5
 *
 * @param Rain BGS
 * @parent Min pouring power
 * @type file
 * @dir audio/bgs
 * @desc Rain background sound. (Leave empty to have no BGS)
 * @default River
 *
 * @param Pouring BGS
 * @parent Min pouring power
 * @type file
 * @dir audio/bgs
 * @desc Pouring background sound. (Leave empty to have no BGS)
 * @default Storm1
 *
 * @param Battle Weather
 * @type boolean
 * @desc Inherit weather effects to battle screen?
 * @default true
 *
 * @param Disable weather indoors
 * @type boolean
 * @desc Do you want to disable weather in <indoors> tagged maps/tilesets?
 * @default true
 *
 * @param Transition time
 * @type number
 * @desc How many frames to wait for full effect.
 * Default: 300
 * @default 300
 *
 * @param Weather Variable
 * @type variable
 * @desc Variable where current weather ID is stored.
 * 0 = Not in use
 * @default 0
 * 
 * @param No flashing on indoor maps
 * @type boolean
 * @desc If enabled/true no more flash effect indoors (won't disable audio). To disable audio also use <no_lightnings> tag!
 * @default false
 * 
 * @param Indoors volume multiplier
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @desc Adjusts the BGS volume multiplier.
 * 0 = No audio at all, 1 = full volume / Default: 0.25
 * @default 0.25
 * 
 * @param Indoors pitch multiplier
 * @type number
 * @decimals 2
 * @min 0
 * @max 2
 * @desc Adjusts the BGS pitch multiplier.
 * @default 0.8
 * 
 * @param Weather captions
 * @type boolean
 * @desc This parameter is used for grouping
 * @default true
 * 
 * @param Clear caption
 * @parent Weather captions
 * @type text
 * @desc Caption for built-in clear weather
 * @default Clear
 * 
 * @param Rain caption
 * @parent Weather captions
 * @type text
 * @desc Caption for built-in rain weather
 * @default Rain
 * 
 * @param Storm caption
 * @parent Weather captions
 * @type text
 * @desc Caption for built-in storm weather
 * @default Storm
 * 
 * @param Snow caption
 * @parent Weather captions
 * @type text
 * @desc Caption for built-in snow weather
 * @default Snow
 * 
 * @param Show weather in menu
 * @type boolean
 * @desc Show weather in menu.
 * @default true
 * 
 * @param Built-in weather duration
 * @type number
 * @desc How many in-game minutes should built-in 'vanilla' weather command last?
 * Default: 1440
 * @default 1440
 * 
 * @param Weather darkness
 * @type number
 * @desc How dark the strongest storm can be? Number given; is power * multiplier for dimmer opacity.
 * Default: 8
 * @default 8
 *
 * @param Debug mode
 * @type boolean
 * @desc Write some events to console log (F8 or F12).
 * @default false
 * 
 * @help
 * ----------------------------------------------------------------------------
 * Introduction                                      (Embedded OcRam_Core v1.5)
 * ============================================================================
 * Weather Extensions to default weather system. This is what this plugin does:
 *      - Weather can be inherited to battle scene
 *      - Storm, blizzard and rain may have BGS (volume varied by power)
 *      - Dynamic lightnings to storm (on desired power via auto pan / pitch)
 *      - Weather BGS is DEDICATED, so it won't interfere other BGS
 *      - Choose if you want to use 'OcRam tuned' enhanced weather effects!
 *
 * Enhanced weather sprites have individual 'depth' and 'snow' type of weather
 * has BLIZZARD mode (adjusted by parameter 'Min blizzard power')!
 *
 * Lightning strikes can be heard also inside maps, but not so loud! Or you
 * can disable lightnings totally with <no_lightnings> tag!
 *
 * <no_lightnings> will also mute bgs2 and bgs3! Otherwise indoor maps are
 * decresed weather volume by 90%.
 *
 * You may use in-game weather command. OR you can implement your own weather
 * system with little configuring and plugin commands!
 *
 * NOTE: Using weather info elements requires OcRam_Time_System -plugin!
 * https://forums.rpgmakerweb.com/index.php?threads/ocram-time-system.107735
 *
 * Sources: W3Schools & RMMV
 * 
 * ----------------------------------------------------------------------------
 * Usage (for CUSTOM/DYNAMIC weather system)
 * ============================================================================
 *
 * 1. Setup weather pools and different type of weathers
 *
 * 2. Write to tileset/map meta which pools it is using. (If meta isn't written
 *    random weather IS NOT in use >> you have to use plugin commands)
 *    META EXAMPLE (for tileset/map): <weather-pools:1,2>
 *    NOTE: Map meta will override tileset meta
 *
 * 3. SEE MORE DETAILED TUTORIAL IN OcRam_Weather_EX thread on RPG Maker forum!
 *
 * Plugin commands:
 *
 *    To set auto-weather on:           auto-weather on
 *    To set auto-weather off:          auto-weather off
 *
 *    To clear any weather effects:     weather-clear
 *
 *    ([dur] = duration in seconds, [fade] = fade time in frames)
 *    To set desired weather:           weather-set [id] [power] [fade] [dur]
 *                                      Example: weather-set 1 6 320 300
 *
 *    built-in weathers are negative:   weather-set -2 9 320
 *    (0 = None, -1 = Rain, -2 = Storm, -3 = Snow)
 *    (built-in weathers may not have duration specified)
 *
 *    To have random weather from pool: weather-random [poolId]
 *                                      Example: weather-random 1
 *
 *    Random weather from ANY pool:     weather-random *
 *
 *    Random weather from CURRENT pool: weather-random
 *
 * ----------------------------------------------------------------------------
 * Terms of Use
 * ============================================================================
 * Edits are allowed as long as "Terms of Use" is not changed in any way.
 * Exception: Obfuscating and/or minifying JS, where ALL comments are removed
 * (incluging these "Terms of Use"), is allowed (won't change ToU itself).
 *
 * NON-COMMERCIAL USE: Free to use with credits to 'OcRam'
 *
 * If you gain money with your project by ANY MEANS (including: donations,
 * crypto-mining, micro-transactions, advertisements, merchandises etc..)
 * it's considered as COMMERCIAL use of this plugin!
 *
 * COMMERCIAL USE: (Standard license: 10 EUR, No-credits license: 50 EUR)
 * Payment via PayPal (https://paypal.me/MarkoPaakkunainen), please mention
 * PLUGIN NAME(S) you are buying / ALL plugins and your PROJECT NAME(S).
 *
 * Licenses are purchased per project and standard licenses requires credits.
 * ALL of my plugins for 1 project = 40 EUR (standard licenses).
 *
 * License for lifetime is 3x base price of any license / bundle. Permission
 * to use this type of license only in projects where you own most of it.
 * Else project license OR project owner lifetime license is required.
 *
 * https://forums.rpgmakerweb.com/index.php?threads/ocram-weather_ex.89721/
 *
 * DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS PLUGIN AS YOUR OWN!
 * Copyright (c) 2021, Marko Paakkunainen // mmp_81 (at) hotmail.com
 *
 * ----------------------------------------------------------------------------
 * Version History
 * ============================================================================
 * 2018/01/10 v1.00 - Initial release
 * 2019/05/25 v2.00 - New feature: Create CUSTOM weathers!
 *                    New feature: Weather pools! (Group custom weathers)
 *                    New feature: Use ENHANCED core weather effects!
 *                    New feature: Snow has sub type 'BLIZZARD' after x power
 *                    New feature: Rain has sub type 'Pouring' after x power
 *                    New feature: Fully AUTOMATED weather system!
 *                    New plugin command: weather-clear
 *                    New plugin command: weather-set
 *                    New plugin command: weather-random
 *                    Possible to tag tilesets/maps with <indoors> tag!
 *                    Possible to tag tilesets/maps with <no_lightnings> tag!
 *                    Added debug mode + integration to OcRam_Time_System
 *                    Re-worked and typed plugin parameters!
 * 2019/08/25 v2.01 - Fixed bug where missing weather pools caused error
 * 2019/09/07 v2.02 - New param "No flashing on indoor maps"
 * 2019/10/06 v2.03 - Weather BGS will not "jump" to start after menu/save
 *                    Automated lightnings now checks "Min storm power"
 * 2020/02/22 v2.04 - Included OcRam core v1.03
 *                    All images are now located in .\img\ocram -folder!
 *                    Weather info on map and in menu (Credits to: dragonx777)
 *                    (Weather info on map requires OcRam_Time_System v2.02)
 *                    Plugin parameters for built-in weather captions
 * 2020/02/22 v2.05 - Lightning common event plugin parameter
 *                    (Credits to: Parallax Panda)
 * 2020/02/23 v2.06 - Fixed undefined error in built-in weathers
 * 2020/03/14 v2.07 - OcRam core v1.04 (requirement for all of my plugins)
 *                    Regulating weather and pool values on plugin load... So
 *                    no need to regulate them in-game (speed++)
 *                    New plugin parameter: "Built-in weather duration"
 * 2020/06/12 v2.08 - Reborn weather sprite won't create un-used 
 *                    bitmaps anymore (Credits to BurningOrca for report)
 *                    
 *                    Ensures now that audio is stopped when exiting game
 *                    
 *                    Rain3 default bgs changed to match default assets
 *                    
 *                    New plugin parameter "Weather darkness"
 *                    (Credits to yeahchris)
 *                    
 *                    Weather timers are now saved properly
 *                    
 *                    Fixed bug where "Test event" crashed game - Requires
 *                    OcRam_Core v1.5 (Credits to jjraymonds)
 *                    
 * 2020/07/01 v2.09 - Indoors now has volume and pitch multipliers
 *                    also fixed bug when re-entering indoors didn't play BGS
 *                    (Credits to OpenTangent)
 * 2020/07/12 v2.10 - Fixed game crash if $gameMap._tilesetId was not found.
 * 2021/08/30 v2.11 - Fixed indoors weather BGS multiplier bug.
 *                    (Credits to Foerster)
 * 2021/08/31 v2.12 - HotFix for previous update! (Credits to Foerster)
 */
/*
 * ----------------------------------------------------------------------------
 * RMMV CORE function overrides (destructive) are listed here
 * ============================================================================
 *     Game_Interpreter.prototype.command236
 */

/*~struct~WeatherPools:
 *
 * @param Id
 * @type number
 * @min 1
 * @desc Pool ID (use this ID on meta data and plugin commands).
 *
 * @param Name
 * @type text
 * @desc Pool name (more human readable).
 * @default My_Pool_Name
 *
 * @param PowerBoost
 * @type number
 * @min -8
 * @max 8
 * @desc Boost weather power by this number. -8 to 8
 * @default 0
 *
 * @param MinClearTime
 * @type number
 * @default 120
 * @desc Minimum duration for 1 cycle of clear weather.
 * (if no weather effects are applied)
 *
 * @param MaxClearTime
 * @type number
 * @default 240
 * @desc Maximum duration for 1 cycle of clear weather.
 * (if no weather effects are applied)
 *
 * @param ClearChance
 * @type number
 * @min 0
 * @max 100
 * @desc Adjusts the BASE chance % for clear weather on each time weather is randomized. 100 = always clear weather.
 * @default 50
 *
 * @param ProbableWeatherIds
 * @type number[]
 * @desc Weathers that are probable in this pool.
 * @default ["0"]
 *
 * @param ProbableBonus
 * @type number
 * @min 0
 * @max 100
 * @desc Adjusts the bonus to probable weathers roll. 100 = always this weather.
 * @default 25
 *
 * @param ImprobableWeatherIds
 * @type number[]
 * @desc Weathers that are probable in this pool.
 * @default ["0"]
 *
 * @param ImprobablePenalty
 * @type number
 * @min 0
 * @max 100
 * @desc Adjusts the penalty to improbable weathers roll. 100 = never this weather.
 * @default 25
 *
 */

/*~struct~Weather:
 *
 * @param Id
 * @type number
 * @desc Weather ID.
 * @default 1
 *
 * @param Name
 * @type text
 * @desc Weather name.
 * @default Weather1
 *
 * @param Type
 * @desc Weather type.
 * @type select
 * @option None
 * @value 0
 * @option Rain
 * @value 1
 * @option Storm
 * @value 2
 * @option Snow
 * @value 3
 * @default 0
 *
 * @param PossiblePoolIds
 * @type number[]
 * @desc Possible pool Ids.
 * @default ["1", "2", "3"]
 *
 * @param PluginCommands
 * @type text[]
 * @desc Use to have supportive weather effects.
 * @default []
 *
 * @param WeatherBGS1
 * @type file
 * @dir audio/bgs
 * @desc Play this BGS on dedicated channel 1. NOTE: This channel is also used by CORE weathers.
 *
 * @param WeatherBGS2
 * @type file
 * @dir audio/bgs
 * @desc Play this BGS on dedicated channel 2.
 *
 * @param MinDuration
 * @type number
 * @desc Minimum duration of this weather.
 * @default 60
 *
 * @param MaxDuration
 * @type number
 * @desc Maximum duration of this weather.
 * @default 480
 *
 */

(function () {

    // ------------------------------------------------------------------------------
    // Private Utility functions - Inherited to all sub scopes here
    // ==============================================================================

    var OcRam_Utils = {}; var _this = this;

    // ------------------------------------------------------------------------------
    // Plugin parameters
    // ==============================================================================

    var _battleWeather = OcRam.getBoolean(this.parameters['Battle Weather']);

    var _minStormPower = Number(this.parameters['Min storm power']);
    var _lightningWait = Number(this.parameters['Lightning wait']);
    var _lightningFrequency = Number(this.parameters['Lightning frequency']);
    var _lightningCE = Number(this.parameters['Lightning CE'] || 0);
    
    var _minBlizzardPower = Number(this.parameters['Min blizzard power']);
    var _blizzardBGS = String(this.parameters['Blizzard BGS']);
    var _lightningVariation = parseFloat(this.parameters['Lightning variation']);
    var _thunderSE = String(this.parameters['Thunder SE']);
    var _pouringBGS = String(this.parameters['Pouring BGS']);
    
    var _stormBGS = String(this.parameters['Storm BGS']);
    var _weatherVarId = Number(this.parameters['Weather Variable']);
    var _transitionTime = Number(this.parameters['Transition time']);
    var _maxWeatherSprites = Number(this.parameters['Max weather sprites']);

    var _minPouringPower = Number(this.parameters['Min pouring power']);
    var _rainBGS = String(this.parameters['Rain BGS']);

    var _weatherName0 = String(this.parameters['Clear caption']);
    var _weatherName1 = String(this.parameters['Rain caption']);
    var _weatherName2 = String(this.parameters['Storm caption']);
    var _weatherName3 = String(this.parameters['Snow caption']);

    var _useEnhancedWeather = OcRam.getBoolean(this.parameters['Use enhanced weather']);
    var _useDynamicWeather = OcRam.getBoolean(this.parameters['Use dynamic weather']);
    var _disableWeatherIndoors = OcRam.getBoolean(this.parameters['Disable weather indoors']);

    var _clearInstructions = OcRam.getJSON(this.parameters['Clear instructions']);
    var _indoorsInstructions = OcRam.getJSON(this.parameters['Indoors instructions']);
    var _jsonPools = OcRam.getJSONArray(this.parameters['Weather pools']);
    var _jsonWeathers = OcRam.getJSONArray(this.parameters['Weathers']);

    var _showWeatherInMenu = OcRam.getBoolean(this.parameters['Show weather in menu']);
    var _builtInWeatherDuration = Number(this.parameters['Built-in weather duration']);
    var _weatherDarkness = Number(this.parameters['Weather darkness']);
    if (_weatherDarkness < 1) _weatherDarkness = 8;

    var _indoorsVolumeMultiplier = parseFloat(this.parameters['Indoors volume multiplier']);
    var _indoorsPitchMultiplier = parseFloat(this.parameters['Indoors pitch multiplier']);

    _jsonWeathers.push({ Id: 0, Name: _weatherName0, PossiblePoolIds: "[]", Type: 0, MinDuration: 60, MaxDuration: 360 });
    _jsonWeathers.push({ Id: -1, Name: _weatherName1, PossiblePoolIds: "[]", Type: 1, MinDuration: 60, MaxDuration: 360 });
    _jsonWeathers.push({ Id: -2, Name: _weatherName2, PossiblePoolIds: "[]", Type: 2, MinDuration: 60, MaxDuration: 360 });
    _jsonWeathers.push({ Id: -3, Name: _weatherName3, PossiblePoolIds: "[]", Type: 3, MinDuration: 60, MaxDuration: 360 });

    var _noFlashIndoors = OcRam.getBoolean(this.parameters['No flashing on indoor maps']);

    this.debug("Weather pools (" + _jsonPools.length + "):", _jsonPools);
    this.debug("Weathers (" + _jsonWeathers.length + "):", _jsonWeathers);

    var _gameSysLoading = false;
    var _isIndoors = false;
    var _noLightnings = false;
    var _weatherDurationCounter = 0;
    var _possibleWeatherPools = [];
    var _possibleWeathers = [];

    var _currentRndPool = null;
    var _currentRndWeather = null;
    var _prevSeason = 0;

    // REGULATE POOLS
    _jsonPools.forEach(function (t) {
        t.Id = Number(t.Id);
        t.ClearChance = Number(t.ClearChance);
        t.ImprobablePenalty = Number(t.ImprobablePenalty);
        t.MaxClearTime = Number(t.MaxClearTime);
        t.MinClearTime = Number(t.MinClearTime);
        t.PowerBoost = Number(t.PowerBoost);
        t.ProbableBonus = Number(t.ProbableBonus);
        t.ImprobableWeatherIds = eval((t.ImprobableWeatherIds).replace(/\"/gi, ""));
        t.ProbableWeatherIds = eval((t.ProbableWeatherIds).replace(/\"/gi, ""));
    });

    // REGULATE WEATHERS
    _jsonWeathers.forEach(function (t) {
        t.Id = Number(t.Id); t.Type = Number(t.Type);
        t.MaxDuration = Number(t.MaxDuration); t.MinDuration = Number(t.MinDuration);
        t.PossiblePoolIds = eval((t.PossiblePoolIds).replace(/\"/gi, ""));
        t.PluginCommands = eval(t.PluginCommands);
    });

    // ------------------------------------------------------------------------------
    // Public Utility functions - Usage: OcRam.PluginName.funcName([args]);
    // ==============================================================================
    this.getJsonWeatherById = function (weather_id) {
        var ret = null;
        _jsonWeathers.forEach(function (p) {
            if (parseInt(p.Id) == Number(weather_id)) {
                ret = p; return;
            }
        }); return ret;
    };

    this.getWeatherName = function () {
        if (_weatherVarId != 0) {
            var wn = this.getJsonWeatherById(Number($gameVariables.value(_weatherVarId)));
            if (wn) {
                return this.getJsonWeatherById(Number($gameVariables.value(_weatherVarId))).Name;
            } else {
                return _weatherName0;
            }
        } else {
            return _weatherName0;
        }
    };

    this.getCurrentWeather = function () {
        return this.getJsonWeatherById(Number($gameVariables.value(_weatherVarId)));
    };

    this.getWeathers = function () {
        return _jsonWeathers;
    };

    this.getWeatherPools = function () {
        return _jsonPools;
    };

    // ------------------------------------------------------------------------------
    // Plugin commands
    // ==============================================================================
    this.extend(Game_Interpreter, "pluginCommand", function (command, args) {
        switch (command) {
            case "weather-clear": _this.debug(command, args);
                $gameScreen.clearWeather_OC(); break;
            case "auto-weather": case "dynamic-weather": _this.debug(command, args);
                if (args[0] == undefined) args[0] = "on";
                args[0] = args[0].toLowerCase();
                if (args[0] == "on") {
                    _useDynamicWeather = true;
                } else if (args[0] == "off") {
                    _useDynamicWeather = false;
                }
                break;
            case "weather-set": _this.debug(command, args); // [weather_id] [power] [fade] [duration]
                if (parseInt(args[0]) > 0) {
                    setWeatherById(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]), parseInt(args[3]), true);
                } else if (parseInt(args[0] < 0)) {
                    executeBuiltInWeather(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]));
                } break;
            case "weather-random": _this.debug(command, args);
                if (args[0] === undefined || args[0] == null) args[0] = "$";
                if (parseInt(args[0]) > 0) {
                    setRandomWeather(parseInt(args[0]));
                } else if (args[0] == "$") {
                    setRandomWeather();
                } else {
                    setRandomWeather(getRandomPoolId());
                } break;
            default:
                _this["Game_Interpreter_pluginCommand"].apply(this, arguments);
        }
    });

    // ------------------------------------------------------------------------------
    // Integrations
    // ==============================================================================
    var _useTimeSystem = false;

    if (Imported.OcRam_Time_System) {
        if (parseFloat(OcRam_Time_System.version) < 2.02) {
            _this.debug("OcRam_Time_System must be at least v2.02!", "Can't use time system!");
        } else {
            _this.debug("OcRam_Time_System:", "Loaded successfully!"); _useTimeSystem = true;
        }
    }

    if (_useTimeSystem) { // We have time system

        var OC_Window_processInterval_OC = window.processInterval_OC;
        window.processInterval_OC = function () {
            OC_Window_processInterval_OC.call(this);
            if (_useDynamicWeather) {
                _weatherDurationCounter--; // NEW WEATHER?
                if (_weatherDurationCounter < 1) setRandomWeather();
            }
        };

    } else { // Create own timer and isIndoors -check

        window._OC_Weather_Timer = window.setInterval(function () {
            if (_useDynamicWeather) {
                if (!_this._menuCalled) {
                    _weatherDurationCounter--; // NEW WEATHER?
                    if (_weatherDurationCounter < 1) setRandomWeather();
                }
            }
        }, 1000);

        Game_System.prototype.isIndoors = function () { return _isIndoors; };

    }

    this.extend(Game_System, "onBeforeSave", function () {
        var obj = null;
        if (_currentRndWeather) {
            obj = {}; obj.Id = _currentRndWeather.Id;
            obj.ClearChance = _currentRndWeather.ClearChance;
            obj.ImprobablePenalty = _currentRndWeather.ImprobablePenalty;
            obj.MaxClearTime = _currentRndWeather.MaxClearTime;
            obj.MinClearTime = _currentRndWeather.MinClearTime;
            obj.PowerBoost = _currentRndWeather.PowerBoost;
            obj.ProbableBonus = _currentRndWeather.ProbableBonus;
            obj.ImprobableWeatherIds = _currentRndWeather.ImprobableWeatherIds;
            obj.ProbableWeatherIds = _currentRndWeather.ProbableWeatherIds;
            obj.Power = _currentRndWeather.Power;
        } this._weatherDurationCounter_OC = _weatherDurationCounter; this._currentWeather_OC = obj;
        _this["Game_System_onBeforeSave"].apply(this, arguments);
    });

    this.extend(Game_System, "onAfterLoad", function () {
        _weatherDurationCounter = this._weatherDurationCounter_OC; _currentRndWeather = this._currentWeather_OC;
        _gameSysLoading = true; _this["Game_System_onAfterLoad"].apply(this, arguments); 
    });

    this.extend(Scene_Save, "initialize", function () {
        _this["Scene_Save_initialize"].apply(this, arguments); _this._menuCalled = true;
    });

    this.extend(Scene_Map, "start", function () {
        _this["Scene_Map_start"].apply(this, arguments);
        if (_gameSysLoading && _currentRndWeather) {
            setWeatherById(parseInt(_currentRndWeather.Id), parseInt(_currentRndWeather.Power), 0, _weatherDurationCounter, true);
            _gameSysLoading = false;
        }
    });

    this.extend(Scene_Map, "onMapLoaded", function () {
        _this["Scene_Map_onMapLoaded"].apply(this, arguments);
        if (_this._menuCalled) {
            _this._menuCalled = false; return;
        } else {
            setIndoorsFlag();
        } if ($gameSystem.isIndoors()) {
            _indoorsInstructions.forEach(function (plugin_cmd) {
                executePluginCommand(plugin_cmd);
            });

            if (_noLightnings) {
                var this_bgs = { name: '', volume: 0, pitch: 100, pan: 0, pos: 0 };
                AudioManager.playBgs2(this_bgs); AudioManager.playBgs3(this_bgs);
            } else {

                this_bgs = getCurrentWeatherBGS1();
                AudioManager.playBgs2(this_bgs);
                this_bgs = getCurrentWeatherBGS2();
                AudioManager.playBgs3(this_bgs);

                /*if (AudioManager._currentBgs2 !== null) {
                    _this.debug("Decrease bgs2 volume to:", AudioManager._currentBgs2.volume * _indoorsVolumeMultiplier);
                    AudioManager._currentBgs2.volume *= _indoorsVolumeMultiplier;
                    AudioManager._currentBgs2.pitch *= _indoorsPitchMultiplier;
                    AudioManager.playBgs2({
                        name: AudioManager._currentBgs2.name,
                        volume: (AudioManager._currentBgs2.volume * _indoorsVolumeMultiplier),
                        pitch: (AudioManager._currentBgs2.pitch * _indoorsPitchMultiplier) | 0,
                        pan: AudioManager._currentBgs2.pan,
                        pos: AudioManager._currentBgs2.pos
                    });
                }
                if (AudioManager._currentBgs3 !== null) {
                    _this.debug("Decrease bgs3 volume to:", AudioManager._currentBgs3.volume * _indoorsVolumeMultiplier);
                    AudioManager._currentBgs3.volume *= _indoorsVolumeMultiplier;
                    AudioManager._currentBgs3.pitch *= _indoorsPitchMultiplier;
                    AudioManager.playBgs3({
                        name: AudioManager._currentBgs3.name,
                        volume: (AudioManager._currentBgs3.volume * _indoorsVolumeMultiplier),
                        pitch: (AudioManager._currentBgs3.pitch * _indoorsPitchMultiplier) | 0,
                        pan: AudioManager._currentBgs3.pan,
                        pos: AudioManager._currentBgs3.pos
                    });
                }*/
            }
        } else {
            if (_currentRndWeather != null) {
                setWeatherById(parseInt(_currentRndWeather.Id), parseInt(_currentRndWeather.Power), 0, _weatherDurationCounter, true);
            }
        } _possibleWeatherPools = null;
        if (_useTimeSystem) {
            if (_prevSeason !== OcRam_Time_System._seasonId) {
                setRandomWeather();
            } _prevSeason = OcRam_Time_System._seasonId
        }
    });

    // ------------------------------------------------------------------------------
    // Battle Weather // rpg_sprites.js
    // ==============================================================================
    this.extend(Spriteset_Battle, "createLowerLayer", function () {
        _this["Spriteset_Battle_createLowerLayer"].apply(this, arguments); this.createWeather();
    });
    
    this.extend(Spriteset_Battle, "update", function () {
        this.updateWeather(); _this["Spriteset_Battle_update"].apply(this, arguments);
    });

    // ------------------------------------------------------------------------------
    // Add new methods for battle scene and game screen
    // ==============================================================================
    Spriteset_Battle.prototype.createWeather = function () {
        this._weather = new Weather();
        this._baseSprite.addChild(this._weather);
    };

    Spriteset_Battle.prototype.updateWeather = function () {
        if (_battleWeather == 1) {
            this._weather.type = $gameScreen.weatherType();
            this._weather.power = $gameScreen.weatherPower();
        } else {
            this._weather.type = 0; this._weather.power = 0;
        }
        this._weather.origin.x = 0; this._weather.origin.y = 0;
    };

    Game_Screen.prototype.clearWeather_OC = function () {
        if ($gameVariables == null) return;
        var this_bgs = { name: '', volume: 0, pitch: 100, pan: 0, pos: 0 };
        $gameVariables.setValue(_weatherVarId, 0);
        _clearInstructions.forEach(function (plugin_cmd) {
            executePluginCommand(plugin_cmd);
        }); executeBuiltInWeather(['none', 0, _transitionTime, true]);
        AudioManager.playBgs2(this_bgs); AudioManager.playBgs3(this_bgs);
        _this.debug("Weather...", "cleared!");
    };

    // ------------------------------------------------------------------------------
    // Do not check if is battle screen. Also play bgs, if specified. (rpg_objects.js)
    // ==============================================================================
    Game_Interpreter.prototype.command236 = function () { // type|power|delay|wait
        executeBuiltInWeather(this._params);
        if (this._params[3]) this.wait(this._params[2]); return true;
    };

    // ------------------------------------------------------------------------------
    // Do 'storm flashing' with given parameters.
    // ==============================================================================
    var _framesPassed = 0; var _lightningTimer = 0;

    // ------------------------------------------------------------------------------
    // Snap to Weather_update - rpg_core.js
    // ==============================================================================
    this.extend(Weather, "update", function () {
        _this["Weather_update"].apply(this, arguments); this._updateFlash();
    });

    // ------------------------------------------------------------------------------
    // Add new method
    // ==============================================================================
    Weather.prototype._updateFlash = function () {

        if (this.type != 'storm') return;
        if (this.power < _minStormPower) return;

        _framesPassed++;

        if (_framesPassed > 60) {

            _framesPassed = 0;
            _lightningTimer++;

            if (_lightningTimer > _lightningWait) {
                
                if (100 * Math.random() < _lightningFrequency + (this.power - 5)) {

                    if (_noLightnings) {
                        _lightningTimer = 0;
                    } else {
                        if (_lightningCE) OcRam.runCE(_lightningCE);
                        var variation = 1 - _lightningVariation; variation += _lightningVariation * Math.random();
                        if (variation < 0) { variation = 0; } if (variation > 1) { variation = 1; }
                        if ($gameSystem.isIndoors()) {
                            if (!_noFlashIndoors) $gameScreen.startFlash([255, 255, 255, 196 * variation], [60]); // startFlash: command224
                            var this_se = { name: _thunderSE, volume: 40 * variation, pitch: 60, pan: 0, pos: 0 };
                            AudioManager.playSe(this_se); _lightningTimer = 0; // playSe: command250
                        } else {
                            $gameScreen.startFlash([255, 255, 255, 255 * variation], [60]); // startFlash: command224
                            var this_se = { name: _thunderSE, volume: 90 * variation, pitch: 60, pan: 0, pos: 0 };
                            AudioManager.playSe(this_se); _lightningTimer = 0; // playSe: command250
                        }
                    }
                    
                }

            }

        }

    };

    // ------------------------------------------------------------------------------
    // Utility functions
    // ==============================================================================

    function executeBuiltInWeather(_params) { // type | power | delay | (wait)
        _this.debug("Executed built-in weather", _params);
        $gameScreen.changeWeather(_params[0], _params[1], _params[2]);
        _currentRndWeather = _currentRndWeather || {};
        _weatherDurationCounter = _builtInWeatherDuration;
        var this_bgs = { name: '', volume: 0, pitch: 100, pan: 0, pos: 0 };
        switch (_params[0]) {
            case 'none':
                $gameVariables.setValue(_weatherVarId, 0);
                _currentRndWeather = _this.getJsonWeatherById(0);
                AudioManager.playBgs2(this_bgs); AudioManager.playBgs3(this_bgs); break;
            case 'rain':
                $gameVariables.setValue(_weatherVarId, -1);
                _currentRndWeather = _this.getJsonWeatherById(-1);
                _currentRndWeather.Power = parseInt(_params[1]);
                this_bgs = getCurrentWeatherBGS2();
                AudioManager.playBgs2(this_bgs); break;
            case 'storm':
                $gameVariables.setValue(_weatherVarId, -2);
                _currentRndWeather = _this.getJsonWeatherById(-2);
                _currentRndWeather.Power = parseInt(_params[1]);
                this_bgs = getCurrentWeatherBGS2();
                AudioManager.playBgs2(this_bgs); break;
            case 'snow':
                $gameVariables.setValue(_weatherVarId, -3);
                _currentRndWeather = _this.getJsonWeatherById(-3);
                _currentRndWeather.Power = parseInt(_params[1]);
                this_bgs = getCurrentWeatherBGS2();
                AudioManager.playBgs2(this_bgs); break;
        }
    }

    function getCurrentWeatherBGS1() {
        /*var this_bgs = { name: '', volume: 0, pitch: 100, pan: 0, pos: 0 };
        if (_currentRndWeather && _currentRndWeather.WeatherBGS2 != "") {
            this_bgs = { name: _currentRndWeather.WeatherBGS1, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
        } if ($gameSystem.isIndoors()) { this_bgs.volume *= _indoorsVolumeMultiplier; this_bgs.pitch *= _indoorsPitchMultiplier; }
        return this_bgs;*/
        var cwid = $gameVariables.value(_weatherVarId);
        var this_bgs = { name: '', volume: 0, pitch: 100, pan: 0, pos: 0 };
        switch (cwid) {
            case -1:
                if (_currentRndWeather.Power >= _minPouringPower) {
                    this_bgs = { name: _pouringBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                } else {
                    this_bgs = { name: _rainBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                } break;
            case -2:
                this_bgs = { name: _stormBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 }; break;
            case -3:
                if (_currentRndWeather.Power >= _minBlizzardPower) {
                    this_bgs = { name: _blizzardBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                } break;
            default:
                if (_currentRndWeather) this_bgs = {
                    name: _currentRndWeather.WeatherBGS1, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0
                };
                if (this_bgs.name == "" && _currentRndWeather) {
                    switch (_currentRndWeather.Type) {
                        case 1:
                            if (_currentRndWeather.Power >= _minPouringPower) {
                                this_bgs = { name: _pouringBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                            } else {
                                this_bgs = { name: _rainBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                            } break;
                        case 2:
                            this_bgs = { name: _stormBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 }; break;
                        case 3:
                            if (_currentRndWeather.Power >= _minBlizzardPower) {
                                this_bgs = { name: _blizzardBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                            } break;
                    }
                } break;
        } if ($gameSystem.isIndoors()) { this_bgs.volume *= _indoorsVolumeMultiplier; this_bgs.pitch *= _indoorsPitchMultiplier; }
        return this_bgs;
    }

    function getCurrentWeatherBGS2() {
        var cwid = $gameVariables.value(_weatherVarId);
        var this_bgs = { name: '', volume: 0, pitch: 100, pan: 0, pos: 0 };
        switch (cwid) {
            case -1:
                if (_currentRndWeather.Power >= _minPouringPower) {
                    this_bgs = { name: _pouringBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                } else {
                    this_bgs = { name: _rainBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                } break;
            case -2:
                this_bgs = { name: _stormBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 }; break;
            case -3:
                if (_currentRndWeather.Power >= _minBlizzardPower) {
                    this_bgs = { name: _blizzardBGS, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                } break;
            default:
                if (_currentRndWeather) this_bgs = {
                    name: _currentRndWeather.WeatherBGS2, volume: (_currentRndWeather.Power * 10 + 10), pitch: 100, pan: 0, pos: 0
                }; break;
        } if ($gameSystem.isIndoors()) { this_bgs.volume *= _indoorsVolumeMultiplier; this_bgs.pitch *= _indoorsPitchMultiplier; }
        return this_bgs;
    }

    function getWeatherPools() {

        _possibleWeatherPools = [];

        if (DataManager.isEventTest()) return;

        var tileset_meta = $dataMap ? $dataMap.meta : undefined;
        if (tileset_meta["weather-pools"] !== undefined) {
            _this.debug("weather-pools meta tag found in MAP note field!", tileset_meta);
            var arr_tmp = (tileset_meta["weather-pools"] + ",").split(",");
            for (var i = 0; i < arr_tmp.length; i++) {
                if (parseInt(arr_tmp[i]) > 0) _possibleWeatherPools.push(parseInt(arr_tmp[i]));
            }
        } else if ($dataTilesets[$gameMap._tilesetId]) {
            tileset_meta = $dataTilesets[$gameMap._tilesetId].meta;
            if (tileset_meta["weather-pools"] !== undefined) {
                _this.debug("weather-pools meta tag found in TILESET note field!", tileset_meta);
                var arr_tmp = (tileset_meta["weather-pools"] + ",").split(",");
                for (var i = 0; i < arr_tmp.length; i++) {
                    if (parseInt(arr_tmp[i]) > 0) _possibleWeatherPools.push(parseInt(arr_tmp[i]));
                }
            } else {
                _this.debug("weather-pools meta tag was NOT found!", tileset_meta);
            }
        }
    }

    function getPossibleWeathers(pool_id) {
        _possibleWeathers = [];
        _jsonWeathers.forEach(function (json_weather) {
            var tmp_arr = json_weather.PossiblePoolIds;
            for (var i = 0; i < tmp_arr.length; i++) {
                if (parseInt(tmp_arr[i]) == pool_id) _possibleWeathers.push(parseInt(json_weather.Id));
            }
        });
    }

    function getJsonPoolById(pool_id) {
        var ret = null;
        _jsonPools.forEach(function (json_pool) {
            if (parseInt(json_pool.Id) == pool_id) ret = json_pool;
        }); return ret;
    }

    

    function executePluginCommand(plugin_command) {
        var tmp_arr = (plugin_command + " ").split(" ");
        var params = []; var cmd = tmp_arr[0];
        for (var i = 1; i < tmp_arr.length; i++) {
            if (tmp_arr[i] != "") params.push(tmp_arr[i]);
        } $gameMap._interpreter.pluginCommand(cmd, params);
        _this.debug("Executed plugin command: " + cmd, params);
    }

    function rnd(min, max) {
        return Math.randomInt(Math.ceil(max) - Math.ceil(min)) + Math.ceil(min);
    }
    function rndFloat(min, max, precision) {
        return parseFloat(((max - min) * Math.random() + min).toPrecision(precision || 2));
    }
    function rndNz(min, max) {
        if (Math.ceil(min) == 0 && Math.ceil(max) == 0) return 1;
        var ret = 0;
        while (ret == 0) {
            ret = rnd(min, max);
        } return ret;
    }

    function parsePluginCmd(cmd, power) {

        // LUNATIC MODE:
        // layer 1 fog ${rndNz(-3,3);}! ${rndNz(-3,3);}! ${(power + 1) / 10;}! true 2 repeat:x,y
        // Syntax MUST BE ${...}! CAN'T BE NESTED example: ${${...}!}!
        // To have JS eval type ${jsToEvalHere();}! anywhere in plugin command
        //      power key word refers to current weather power
        //      rnd(-3, 3) function will give random INTEGER between -3 and 3
        //      rndFloat(-3, 3, 2) function will give random 2 decimal FLOAT between -3 and 3
        //      rndNz(-3, 3) function will give random INTEGER between -3 and 3, but no zero

        // ps. Great place to fiddle with regex: https://regex101.com/
        var ret = cmd; var evals = (ret).match(/\$\{.*?\}\!/gm);
        if (evals == undefined) return ret;

        var str_tmp = "";
        for (var i = 0; i < evals.length; i++) {
            str_tmp = evals[i].toString().replace("\$\{", "");
            str_tmp = str_tmp.replace("\}\!", "");
            eval("str_tmp=" + str_tmp).toString;
            ret = ret.replace(evals[i], str_tmp);
        } return ret;

    }

    function setWeatherById(weather_id, power, fade, duration, forced) {

        var str_type = 'none'; _weatherDurationCounter = duration;

        if (_currentRndPool == null) {
            _currentRndPool = { Id: 1, Name: "Default Pool", PowerBoost: 0, MinClearTime: 30, MaxClearTime: 300, ClearChance: 50, ProbableWeatherIds: [0], ProbableBonus: 25, ImprobableWeatherIds: [0], ImprobablePenalty: 25 };
        }

        if (_currentRndPool.PowerBoost) {
            power += parseInt(_currentRndPool.PowerBoost);
            power = (power > 9) ? 9 : (power < 1) ? 1 : power;
        }

        if (parseInt(weather_id) < 0 && forced) {
            if (weather_id == -1) str_type = 'rain';
            if (weather_id == -2) str_type = 'storm';
            if (weather_id == -3) str_type = 'snow';
            executeBuiltInWeather([str_type, power, fade || _transitionTime, true]);
            return;
        }

        var this_weather = _this.getJsonWeatherById(weather_id); // Try to find weather by this id

        if (this_weather) { // We got weather object!

            var probability_adjust = 0;

            if (_currentRndPool.ProbableWeatherIds && _currentRndPool.ProbableWeatherIds.length) {
                for (var i = 0; i < _currentRndPool.ProbableWeatherIds.length; i++) {
                    if (parseInt(_currentRndPool.ProbableWeatherIds[i]) == weather_id) {
                        _this.debug("This is probable weather (" + weather_id + "):", _currentRndPool.ProbableWeatherIds);
                        probability_adjust = -parseInt(_currentRndPool.ProbableBonus);
                    }
                }
            }
            if (_currentRndPool.ImprobableWeatherIds && _currentRndPool.ImprobableWeatherIds.length) {
                for (var i = 0; i < _currentRndPool.ImprobableWeatherIds.length; i++) {
                    if (parseInt(_currentRndPool.ImprobableWeatherIds[i]) == weather_id) {
                        _this.debug("This is improbable weather (" + weather_id + "):", _currentRndPool.ImprobableWeatherIds);
                        probability_adjust = parseInt(_currentRndPool.ImprobablePenalty);
                    }
                }
            }
            
            if ((100 * Math.random() <= probability_adjust + parseInt(_currentRndPool.ClearChance)) && !forced) {
                //_this.debug("probability_adjust:", probability_adjust);
                if (probability_adjust > 0) { setRandomWeather(); return; }
                $gameScreen.clearWeather_OC(); _currentRndWeather = null;
                _weatherDurationCounter = duration || (Math.randomInt(parseInt(_currentRndPool.MaxClearTime) - parseInt(_currentRndPool.MinClearTime)) + parseInt(_currentRndPool.MinClearTime));
                _this.debug("Clear weather...", "For duration: " + _weatherDurationCounter); return;
            } $gameScreen.clearWeather_OC();

            var this_bgs = { name: '', volume: 0, pitch: 100, pan: 0, pos: 0 };
            $gameVariables.setValue(_weatherVarId, weather_id); // SET Weather ID variable

             // Execute built-in weather
            if (parseInt(this_weather.Type) == 1) str_type = 'rain';
            if (parseInt(this_weather.Type) == 2) str_type = 'storm';
            if (parseInt(this_weather.Type) == 3) str_type = 'snow';
            executeBuiltInWeather([str_type, power, fade || _transitionTime, true]);

            // Set current weather for indoors/outdoors swapping!
            _currentRndWeather = this_weather; _currentRndWeather.Power = power;

            $gameVariables.setValue(_weatherVarId, weather_id); // SET Weather ID variable

            if ($gameSystem.isIndoors() && _disableWeatherIndoors) return; // IF weather was changed indoors and it should not >> don't do it...

            // Execute supportive plugin commands
            var cmd_arr = this_weather.PluginCommands;
            if (cmd_arr && cmd_arr.length) {
                for (var i = 0; i < cmd_arr.length; i++) {
                    if (cmd_arr[i] != "") {
                        var parsed_cmd = parsePluginCmd(cmd_arr[i], power);
                        executePluginCommand(parsed_cmd);
                    }
                }
            }

            // Execute BGS - Will override any default BGS from CORE weathers...
            if (this_weather.WeatherBGS1 != "") {
                this_bgs = { name: this_weather.WeatherBGS1, volume: (power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                AudioManager.playBgs2(this_bgs); this_bgs = { name: '', volume: 0, pitch: 100, pan: 0, pos: 0 };
            } if (this_weather.WeatherBGS2 != "") this_bgs = { name: this_weather.WeatherBGS2, volume: (power * 10 + 10), pitch: 100, pan: 0, pos: 0 };
            AudioManager.playBgs3(this_bgs);

            _weatherDurationCounter = duration || rnd(this_weather.MinDuration, this_weather.MaxDuration); // How long does this weather exist?
            
            _this.debug("setWeatherById(" + weather_id + ", " + power + ") | For duration: " + _weatherDurationCounter, this_weather);

        } 
    }

    function setRandomWeather(pool) {

        if (_possibleWeatherPools == null) getWeatherPools();

        var randomized_pool_id = 0;
        randomized_pool_id = (!pool) ? _possibleWeatherPools[Math.randomInt(_possibleWeatherPools.length)] : pool;

        if (randomized_pool_id !== undefined) {
            _this.debug("Randomized pool id:", randomized_pool_id);
            _currentRndPool = getJsonPoolById(randomized_pool_id);
            getPossibleWeathers(randomized_pool_id);
            var randomized_weather_id = _possibleWeathers[Math.randomInt(_possibleWeathers.length)];
            if (randomized_weather_id !== undefined) {
                _this.debug("Randomized weather id:", randomized_weather_id);
                setWeatherById(randomized_weather_id, (Math.randomInt(8) + 1));
            }
        }

    }

    function setIndoorsFlag() { // Use this function only if time system is NOT imported

        if (DataManager.isEventTest()) return;

        var tileset_meta = $dataMap.meta;
        if (tileset_meta["no_lightnings"] !== undefined) {
            _this.debug("'No lightnings' meta tag found in MAP note field!", tileset_meta);
            _noLightnings = true;
        } else {
            tileset_meta = $dataTilesets[$dataMap.tilesetId].meta;
            if (tileset_meta["no_lightnings"] !== undefined) {
                _this.debug("'No lightnings' meta tag found in TILESET note field!", tileset_meta);
                _noLightnings = true;
            } else {
                _this.debug("'No lightnings' meta tag was NOT found!", tileset_meta);
                _noLightnings = false;
            }
        }

        if (_useTimeSystem) return;

        tileset_meta = $dataMap.meta;
        if (tileset_meta["indoors"] !== undefined) {
            _this.debug("Indoors meta tag found in MAP note field!", tileset_meta);
            _isIndoors = true;
        } else {
            tileset_meta = $dataTilesets[$dataMap.tilesetId].meta;
            if (tileset_meta["indoors"] !== undefined) {
                _this.debug("Indoors meta tag found in TILESET note field!", tileset_meta);
                _isIndoors = true;
            } else {
                _this.debug("Indoors meta tag was NOT found!", tileset_meta);
                _isIndoors = false;
            }
        }
    }

    function getRandomPoolId() {
        return parseInt(_jsonPools[Math.randomInt(_jsonPools.length)].Id);
    }

    // ------------------------------------------------------------------------------
    // OcRam - Enhanced weather overrides
    // ==============================================================================
    if (_useEnhancedWeather) {

        this.debug("USING ENHANCED WEATHER!", _useEnhancedWeather);

        var _maxDepth = 20;

        var _pi16 = Math.PI / 16;
        var _pi8 = Math.PI / 8;

        var _preCalcSnowSin = 3 * Math.sin(_pi16);
        var _preCalcSnowCos = 2 * Math.cos(_pi16);
        var _preCalcBlizzardSin = 3 * Math.sin(_pi8);
        var _preCalcBlizzardCos = 2 * Math.cos(_pi8);

        var _preCalcRainSin = 5 * Math.sin(_pi16);
        var _preCalcRainCos = 5 * Math.cos(_pi16);
        var _preCalcStormSin = 6 * Math.sin(_pi8);
        var _preCalcStormCos = 6 * Math.cos(_pi8);

        // Create bitmaps (pre-drawn and -calculated)
        Weather.prototype._createBitmaps = function () {

            var tmp_depth = 0;
            this._rainBitmap = [];
            for (var i = 0; i < 3; i++) {
                tmp_depth = 0.8 + ((i + 1) * 0.25); // pre-calc speed multiplier
                this._rainBitmap.push(new Bitmap(1, 20 + (i * 10)));
                this._rainBitmap[i].fillAll('white');
                this._rainBitmap[i]._depth_OC = tmp_depth;
            }

            this._stormBitmap = [];
            for (var i = 0; i < 3; i++) {
                tmp_depth = 0.8 + ((i + 1) * 0.25); // pre-calc speed multiplier
                this._stormBitmap.push(new Bitmap(2, 40 + (i * 15)));
                this._stormBitmap[i].fillAll('white');
                this._stormBitmap[i]._depth_OC = tmp_depth;
            }
            
            this._snowBitmap = [];
            for (var i = 0; i < 3; i++) {
                tmp_depth = (i + 2);
                this._snowBitmap.push(new Bitmap(tmp_depth * 4, tmp_depth * 4));
                this._snowBitmap[i].drawCircle(tmp_depth, tmp_depth, tmp_depth, 'white');
                this._snowBitmap[i]._depth_OC = tmp_depth;
            }

        };

        Weather.prototype._updateAllSprites = function () {
            if ($gameSystem.isIndoors()) return;
            var maxSprites = Math.floor(this.power * _maxWeatherSprites);
            while (this._sprites.length < maxSprites) {
                this._addSprite();
            }
            while (this._sprites.length > maxSprites) {
                this._removeSprite();
            }
            this._sprites.forEach(function (sprite) {
                this._updateSprite(sprite);
                sprite.x = sprite.ax - this.origin.x;
                sprite.y = sprite.ay - this.origin.y;
            }, this);
        };

        // Override totally ...no need to switch anything >> Everything is pre-calculated!
        Weather.prototype._updateSprite = function (sprite) {
            sprite.ax -= sprite._horizontalSpeed;
            sprite.ay += sprite._verticalSpeed;
            sprite.opacity -= sprite._fadeSubtractor;
            if (sprite.opacity < 40) this._rebornSprite(sprite);
        };

        Weather.prototype._updateDimmer = function () { // Make dimmer little bit darker
            this._dimmerSprite.opacity = Math.floor(this.power * _weatherDarkness);
        };

        // We need this to have _fadeSubtractor initialized...
        var OC_Weather_addSprite = Weather.prototype._addSprite;
        Weather.prototype._addSprite = function () {
            OC_Weather_addSprite.call(this);
            this._sprites[this._sprites.length - 1]._fadeSubtractor = 255;
        };

        Weather.prototype._rebornSprite = function (sprite) {

            var x_adjust = 0; var bm_index = Math.randomInt(3);

            switch (this.type) {
                case 'rain':
                    sprite.bitmap = this._rainBitmap[bm_index];
                    sprite._depth_OC = this._rainBitmap[bm_index]._depth_OC;
                    sprite.rotation = _pi16;
                    sprite._verticalSpeed = _preCalcRainCos * sprite._depth_OC;
                    sprite._horizontalSpeed = _preCalcRainSin * sprite._depth_OC;
                    sprite.opacity = 120; sprite._fadeSubtractor = 6; break;
                case 'storm':
                    sprite.bitmap = this._stormBitmap[bm_index];
                    sprite._depth_OC = this._stormBitmap[bm_index]._depth_OC;
                    sprite.rotation = _pi8;
                    sprite._verticalSpeed = _preCalcStormCos * sprite._depth_OC;
                    sprite._horizontalSpeed = _preCalcStormSin * sprite._depth_OC;
                    sprite.opacity = 80; sprite._fadeSubtractor = 4; break;
                case 'snow':
                    sprite.bitmap = this._snowBitmap[bm_index];
                    sprite._depth_OC = this._snowBitmap[bm_index]._depth_OC;
                    sprite._verticalSpeed = _preCalcBlizzardCos + Math.randomInt(3);
                    if (this.power >= _minBlizzardPower) {
                        sprite._isBlizzard = true; sprite.rotation = _pi8; x_adjust = 140;
                        sprite._horizontalSpeed = _preCalcBlizzardSin + Math.randomInt(2) + 4;
                        sprite._fadeSubtractor = 4;
                    } else {
                        sprite._isBlizzard = false; sprite.rotation = _pi16;
                        sprite._verticalSpeed = _preCalcSnowCos;
                        sprite._horizontalSpeed = _preCalcSnowSin + (Math.randomInt(2) - 1);
                        sprite._fadeSubtractor = 1;
                    } sprite.opacity = 180; break;
            }

            sprite.ax = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x + x_adjust;
            sprite.ay = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;
            sprite.opacity += Math.randomInt(60);

        };

    }

    // ------------------------------------------------------------------------------
    // OcRam - 'Clock' window to MENU (based on 'gold' window)
    // ==============================================================================

    if ((!OcRam.Time_System || !OcRam.getBoolean(OcRam.Time_System.parameters['Show clock in menu'])) && _showWeatherInMenu) {

        this.debug("OcRam.Time_System not imported or no clock info shown in menu");

        _this.getWeathers().forEach(function (w) {
            if (w && w.Id) w._icon = ImageManager.loadOcRamBitmap('weather' + w.Id);
        });

        this.extend(Scene_Menu, "create", function () {
            _this["Scene_Menu_create"].apply(this, arguments);
            this.createClockWindow();
        });

        Scene_Menu.prototype.createClockWindow = function () {
            this._clockWindow = new Window_Clock(0, 0);
            this._clockWindow.y = this._commandWindow.height + 2;
            this.addWindow(this._clockWindow);
        };

        function Window_Clock() {
            this.initialize.apply(this, arguments);
        }

        Window_Clock.prototype = Object.create(Window_Base.prototype);
        Window_Clock.prototype.constructor = Window_Clock;

        Window_Clock.prototype.initialize = function (x, y) {
            var width = this.windowWidth();
            var height = this.windowHeight();
            Window_Base.prototype.initialize.call(this, x, y, width, height);
            this.refresh();
        };

        Window_Clock.prototype.windowWidth = function () {
            return 240;
        };

        Window_Clock.prototype.windowHeight = function () {
            return this.fittingHeight(1) - 4;
        };
        
        Window_Clock.prototype.refresh = function () {

            var width = this.contents.width - this.textPadding() * 2 + 10;
            this.contents.clear(); this.resetTextColor();

            this.contents.fontSize = this.standardFontSize() - 2;
            this.contents.fontFace = this.standardFontFace();

            this.drawText(_this.getWeatherName(), 0, 0, width, 'left');
            var bm = (_this.getCurrentWeather())._icon;
            if (bm) {
                this.contents.blt(bm, 0, 0, bm.width, bm.height, this.contents.width - bm.width - 1, 0);
            }
            
        };

        Window_Clock.prototype.open = function () {
            this.refresh(); Window_Base.prototype.open.call(this);
        };

    }

    // ------------------------------------------------------------------------------
    // Sound channels from OcRam_Audio_EX -plugin (as they are)
    // Define channels only if OcRam_Audio_EX -plugin is NOT imported!
    // ==============================================================================

    if (!Imported.OcRam_Audio_EX) {

        this.debug("OcRam_Audio_EX is NOT imported!", Imported);

        // ------------------------------------------------------------------------------
        // ADDITIONAL DEDICATED BGS CHANNELS THAT ARE PLAYED EVEN IN BATTLE SCENE
        // (intended usage for weather bgs >> rain, storm and wind etc...)
        // ==============================================================================

        var $OcRam_emptyAudio = AudioManager.makeEmptyAudioObject(); $OcRam_emptyAudio.AEX = null;

        // ======================================== BGS channel 3 ========================================
        AudioManager._bgsVolume2 = 100; AudioManager._currentBgs2 = null; AudioManager._bgs2Buffer = null;

        Object.defineProperty(AudioManager, 'bgsVolume2', {
            get: function () {
                return this._bgsVolume2;
            },
            set: function (value) {
                this._bgsVolume2 = value;
                this.updateBgs2Parameters(this._currentBgs2);
            },
            configurable: true
        });
        AudioManager.playBgs2 = function (bgs2, pos) {
            if (this.isCurrentBgs2(bgs2)) {
                this.updateBgs2Parameters(bgs2);
            } else {
                this.stopBgs2();
                if (bgs2.name) {
                    this._bgs2Buffer = this.createBuffer('bgs', bgs2.name);
                    this.updateBgs2Parameters(bgs2);
                    this._bgs2Buffer.play(true, pos || 0);
                    this.fadeInBgs2(4);
                }
            }
            this.updateCurrentBgs2(bgs2, pos);
        };
        AudioManager.replayBgs2 = function (bgs2) {
            if (this.isCurrentBgs2(bgs2)) {
                this.updateBgs2Parameters(bgs2);
            } else {
                this.playBgs2(bgs2, bgs2.pos);
                if (this._bgs2Buffer) {
                    this._bgs2Buffer.fadeIn(this._replayFadeTime);
                }
            }
        };
        AudioManager.isCurrentBgs2 = function (bgs2) {
            return (this._currentBgs2 && this._bgs2Buffer &&
                this._currentBgs2.name === bgs2.name);
        };
        AudioManager.updateCurrentBgs2 = function (bgs2, pos) {
            this._currentBgs2 = {
                name: bgs2.name,
                volume: bgs2.volume,
                pitch: bgs2.pitch,
                pan: bgs2.pan,
                pos: pos
            };
        };
        AudioManager.stopBgs2 = function () {
            if (this._bgs2Buffer) {
                this._bgs2Buffer.stop();
                this._bgs2Buffer = null;
                this._currentBgs2 = null;
            }
        };
        AudioManager.fadeOutBgs2 = function (duration) {
            if (this._bgs2Buffer && this._currentBgs2) {
                this._bgs2Buffer.fadeOut(duration);
                this._currentBgs2 = null;
            }
        };
        AudioManager.fadeInBgs2 = function (duration) {
            if (this._bgs2Buffer && this._currentBgs2) {
                this._bgs2Buffer.fadeIn(duration);
            }
        };
        AudioManager.saveBgs2 = function () {
            if (this._currentBgs2) {
                var bgs2 = this._currentBgs2;
                return {
                    name: bgs2.name,
                    volume: bgs2.volume,
                    pitch: bgs2.pitch,
                    pan: bgs2.pan,
                    pos: this._bgs2Buffer ? this._bgs2Buffer.seek() : 0
                };
            } else {
                return $OcRam_emptyAudio;
            }
        };
        AudioManager.updateBgs2Parameters = function (bgs2) {
            this.updateBufferParameters(this._bgs2Buffer, this._bgsVolume2, bgs2);
        };

        // ======================================== BGS channel 3 ========================================
        AudioManager._bgsVolume3 = 100; AudioManager._currentBgs3 = null; AudioManager._bgs3Buffer = null;

        Object.defineProperty(AudioManager, 'bgsVolume3', {
            get: function () {
                return this._bgsVolume3;
            },
            set: function (value) {
                this._bgsVolume3 = value;
                this.updateBgs3Parameters(this._currentBgs3);
            },
            configurable: true
        });
        AudioManager.playBgs3 = function (bgs3, pos) {
            if (this.isCurrentBgs3(bgs3)) {
                this.updateBgs3Parameters(bgs3);
            } else {
                this.stopBgs3();
                if (bgs3.name) {
                    this._bgs3Buffer = this.createBuffer('bgs', bgs3.name);
                    this.updateBgs3Parameters(bgs3);
                    this._bgs3Buffer.play(true, pos || 0);
                    this.fadeInBgs3(4);
                }
            }
            this.updateCurrentBgs3(bgs3, pos);
        };
        AudioManager.replayBgs3 = function (bgs3) {
            if (this.isCurrentBgs3(bgs3)) {
                this.updateBgs3Parameters(bgs3);
            } else {
                this.playBgs3(bgs3, bgs3.pos);
                if (this._bgs3Buffer) {
                    this._bgs3Buffer.fadeIn(this._replayFadeTime);
                }
            }
        };
        AudioManager.isCurrentBgs3 = function (bgs3) {
            return (this._currentBgs3 && this._bgs3Buffer &&
                this._currentBgs3.name === bgs3.name);
        };
        AudioManager.updateBgs3Parameters = function (bgs3) {
            this.updateBufferParameters(this._bgs3Buffer, this._bgsVolume3, bgs3);
        };
        AudioManager.updateCurrentBgs3 = function (bgs3, pos) {
            this._currentBgs3 = {
                name: bgs3.name,
                volume: bgs3.volume,
                pitch: bgs3.pitch,
                pan: bgs3.pan,
                pos: pos
            };
        };
        AudioManager.stopBgs3 = function () {
            if (this._bgs3Buffer) {
                this._bgs3Buffer.stop();
                this._bgs3Buffer = null;
                this._currentBgs3 = null;
            }
        };
        AudioManager.fadeOutBgs3 = function (duration) {
            if (this._bgs3Buffer && this._currentBgs3) {
                this._bgs3Buffer.fadeOut(duration);
                this._currentBgs3 = null;
            }
        };
        AudioManager.fadeInBgs3 = function (duration) {
            if (this._bgs3Buffer && this._currentBgs3) {
                this._bgs3Buffer.fadeIn(duration);
            }
        };
        AudioManager.saveBgs3 = function () {
            if (this._currentBgs3) {
                var bgs3 = this._currentBgs3;
                return {
                    name: bgs3.name,
                    volume: bgs3.volume,
                    pitch: bgs3.pitch,
                    pan: bgs3.pan,
                    pos: this._bgs3Buffer ? this._bgs3Buffer.seek() : 0
                };
            } else {
                return $OcRam_emptyAudio;
            }
        };

        // Override
        Object.defineProperty(ConfigManager, 'bgsVolume', {
            get: function () {
                return AudioManager.bgsVolume;
            },
            set: function (value) {
                AudioManager.bgsVolume = value;
                AudioManager.bgsVolume2 = value;
                AudioManager.bgsVolume3 = value;
            },
            configurable: true
        }); AudioManager.checkErrors = function () {
            this.checkWebAudioError(this._bgmBuffer);
            this.checkWebAudioError(this._bgsBuffer);
            this.checkWebAudioError(this._bgs2Buffer);
            this.checkWebAudioError(this._bgs3Buffer);
            this.checkWebAudioError(this._meBuffer);
            this._seBuffers.forEach(function (buffer) {
                this.checkWebAudioError(buffer);
            }.bind(this));
            this._staticBuffers.forEach(function (buffer) {
                this.checkWebAudioError(buffer);
            }.bind(this));
        };

    }

}.bind(OcRam.Weather_EX)());