/*:
 * @plugindesc Skip video on key press
 * @author Dmytryk (Dmy, Demetrius)
 *
 * @help This plugin allows to skip videos by pressing the Escape key
 * or Enter key.
 *
 * This plugin relies on MVâ€™s private variables so it is essentially A HACK.
 * It may break in future versions. But for now, it works fine.
 *
 * This plugin is placed into public domain according to the CC0 public domain
 * dedication. See https://creativecommons.org/publicdomain/zero/1.0/ for more
 * information.
 *
 * @param Disabler switch
 * @desc Number of switch. Allows to disable the plugin when the switch is OFF.
 * If set to 0, the plugin will always work.
 * @type number
 * @default 0
 */
/*:ru
 * @plugindesc Ð¡Ð±Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ Ð²Ð¸Ð´ÐµÐ¾ Ð¿Ñ€Ð¸ Ð½Ð°Ð¶Ð°Ñ‚Ð¸Ð¸ Ð½Ð° ÐºÐ»Ð°Ð²Ð¸ÑˆÑƒ
 * @author Dmytryk (Dmy, Demetrius)
 *
 * @help Ð­Ñ‚Ð¾Ñ‚ Ð¿Ð»Ð°Ð³Ð¸Ð½ Ð¿Ð¾Ð·Ð²Ð¾Ð»ÑÐµÑ‚ Ð¿Ñ€Ð¾Ð¿ÑƒÑÑ‚Ð¸Ñ‚ÑŒ Ð²Ð¸Ð´ÐµÐ¾, Ð½Ð°Ð¶Ð°Ð² Ð½Ð° ÐºÐ»Ð°Ð²Ð¸ÑˆÐ¸ Escape Ð¸Ð»Ð¸
 * Enter.
 *
 * Ð­Ñ‚Ð¾Ñ‚ Ð¿Ð»Ð°Ð³Ð¸Ð½ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ Ð²Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½Ð¸Ðµ Ð¿ÐµÑ€ÐµÐ¼ÐµÐ½Ð½Ñ‹Ðµ MV, Ð¿Ð¾ÑÑ‚Ð¾Ð¼Ñƒ ÑÑ‚Ð¾ Ñ…Ð°Ðº.
 * ÐžÐ½ Ð¼Ð¾Ð¶ÐµÑ‚ Ð¿ÐµÑ€ÐµÑÑ‚Ð°Ñ‚ÑŒ Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ñ‚ÑŒ Ð² ÑÐ»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ñ… Ð²ÐµÑ€ÑÐ¸ÑÑ…. ÐÐ¾ Ð¿Ð¾ÐºÐ° Ñ‡Ñ‚Ð¾ Ñ€Ð°Ð±Ð¾Ñ‚Ð°ÐµÑ‚.
 *
 * Ð­Ñ‚Ð¾Ñ‚ Ð¿Ð»Ð°Ð³Ð¸Ð½ Ð¿ÐµÑ€ÐµÐ´Ð°Ð½ Ð² Ð¾Ð±Ñ‰ÐµÑÑ‚Ð²ÐµÐ½Ð½Ð¾Ðµ Ð´Ð¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ ÑÐ¾Ð³Ð»Ð°ÑÐ½Ð¾ CC0. ÐŸÐ¾Ð´Ñ€Ð¾Ð±Ð½ÐµÐµ ÑÐ¼. Ð½Ð°
 * ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ðµ https://creativecommons.org/publicdomain/zero/1.0/deed.ru
 *
 * @param Disabler switch
 * @desc ÐÐ¾Ð¼ÐµÑ€ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡Ð°Ñ‚ÐµÐ»Ñ. ÐŸÐ¾Ð·Ð²Ð¾Ð»ÑÐµÑ‚ Ð¾Ñ‚ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ Ð¿Ð»Ð°Ð³Ð¸Ð½, ÐºÐ¾Ð³Ð´Ð° Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡Ð°Ñ‚ÐµÐ»ÑŒ
 * Ð’ÐšÐ›. Ð•ÑÐ»Ð¸ ÑƒÐºÐ°Ð·Ð°Ñ‚ÑŒ 0, Ñ‚Ð¾ Ð¿Ð»Ð°Ð³Ð¸Ð½ Ð±ÑƒÐ´ÐµÑ‚ Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ñ‚ÑŒ Ð²ÑÐµÐ³Ð´Ð°.
 * @type number
 * @default 0
 */

if (typeof Imported === 'undefined') {
  Imported = {};
}
Imported.DMY_SkipVideo = '0.1';

(function () {

  var parameters = PluginManager.parameters('DMY_SkipVideo');
  var disablerSwitch = Number(parameters['Disabler switch']);

  function videoIsSkippable() {
    if (disablerSwitch === 0 || isNaN(disablerSwitch)) {
      return true;
    }

    return !$gameSwitches.value(disablerSwitch);
  }

  var _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    if (Graphics.isVideoPlaying() && (Input.isTriggered('menu')
                                        || Input.isTriggered('escape')
                                        || Input.isTriggered('cancel')
                                        || Input.isTriggered('ok')
                                        || TouchInput.isCancelled())
                                  && videoIsSkippable()) {
      if ('_video' in Graphics && 'pause' in Graphics._video
                              && typeof Graphics._video.pause === 'function') {
        Graphics._video.pause();
        Graphics._onVideoEnd();
      }
    }
    else {
      _Scene_Map_update.call(this);
    }
  }

})();