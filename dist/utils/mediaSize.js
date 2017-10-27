'use strict';

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MediaSize = {
  SMALL: 350,
  MEDIUM: 768,
  LARGE: 1024
};
var Media = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

var OS = {
  Windows: 'Win',
  MacOS: 'Mac',
  UNIX: 'X11',
  Linux: 'Linux'
};

/**
 * get the mediaInfo by the devices information
 * @param devices
 * @returns {{deviceSize: number, media: string}}
 */
function getMediaFromDevicesInfo(devices) {
  var media = {
    deviceSize: MediaSize.LARGE,
    media: Media.LARGE
  };
  if (devices.pc) {
    media = {
      deviceSize: MediaSize.LARGE,
      media: Media.LARGE
    };
  } else if (devices.tablet) {
    media = {
      deviceSize: MediaSize.MEDIUM,
      media: Media.MEDIUM
    };
  } else if (devices.phone) {
    media = {
      deviceSize: MediaSize.SMALL,
      media: Media.SMALL
    };
  }
  return media;
}
/**
 * get the browser mediaInfo, use screen width by default, and use innerWidth if isInnerWidth is true
 * 1) getBrowserMediaInfo(): returns media info based on screen width;
 * 2) getBrowserMediaInfo(true): returns media infor based on innerWidth;
 * @returns {{deviceSize: number, media: string}}
 */
function getBrowserMediaInfo(isInnerWidth) {
  var media = {
    deviceSize: MediaSize.LARGE,
    media: Media.LARGE
  };
  if (_env2.default.is_client) {
    var width = isInnerWidth ? window.innerWidth : window.screen.width;
    if (width > MediaSize.LARGE) {
      media = {
        deviceSize: MediaSize.LARGE,
        media: Media.LARGE
      };
    } else if (width >= MediaSize.MEDIUM) {
      media = {
        deviceSize: MediaSize.MEDIUM,
        media: Media.MEDIUM
      };
    } else {
      media = {
        deviceSize: MediaSize.SMALL,
        media: Media.SMALL
      };
    }
  }
  return media;
}

function isBrowseBaseOnWebkit() {
  return (/webkit/i.test(navigator.userAgent)
  );
}

function isEdgeBrowser() {
  return (/edge\/\d+/i.test(navigator.userAgent)
  );
}

function isOperatingSystem(OSName) {
  return navigator.appVersion.indexOf(OSName) > -1;
}

function getScrollBarWidth() {
  if (isEdgeBrowser()) {
    return 12;
  } else if (isBrowseBaseOnWebkit()) {
    return 8;
  } else {
    // for firefox some run on MAC browser
    if (isOperatingSystem(OS.MacOS)) {
      return 0;
    }
    return 17;
  }
}

/**
 * getScreenMediaInfo
 * @param  {object} devices
 * @return {string}
 */
function getScreenMediaInfo(devices) {
  return _env2.default.is_client ? getBrowserMediaInfo(true).media : getMediaFromDevicesInfo(devices).media;
}

/**
 * getScreen the screen size: small, medium or large
 * @param  {Boolean} isInnerWidth [description]
 * @return {[type]}               [description]
 */
function getScreen(devices) {
  var media = getScreenMediaInfo(devices);
  var isIOS = devices && devices.os === 'iOS';

  var isHorizontalScreen = false;
  var isNativeScaling = false;
  if (_env2.default.is_client) {
    var _window = window,
        innerWidth = _window.innerWidth,
        outerWidth = _window.outerWidth,
        screen = _window.screen;

    isHorizontalScreen = [90, -90].includes(window.orientation);
    if (isIOS) {
      // iOS devices: screen.width and screen.height will never change, not matter it is portrait or landscape mode
      isNativeScaling = isHorizontalScreen ? screen.height !== innerWidth : screen.width !== innerWidth;
    } else {
      // other devices screen.width and screen.height will switch, when rotating between landscape and portrait mode
      var possibleScreenWidth = [document.documentElement && document.documentElement.clientWidth, screen.width];
      isNativeScaling = !(possibleScreenWidth.includes(innerWidth) || possibleScreenWidth.includes(outerWidth));
    }
  }

  return {
    isSmallScreen: media === Media.SMALL,
    isMediumScreen: media === Media.MEDIUM,
    isLargeScreen: media === Media.LARGE,
    isIOS: isIOS,
    isHorizontalScreen: isHorizontalScreen,
    isNativeScaling: isNativeScaling
  };
}

/**
 * getDevice the real device type: mobile, tablet or desktop
 * @param  {object} devices this.context.devices from mobileDetect
 * @return {object}
 */
function getDevice(devices) {
  var deviceObj = {
    isMobileDevice: false,
    isTabletDevice: false,
    isDesktopDevice: false
  };

  if (devices.pc) {
    deviceObj.isDesktopDevice = true;
  } else if (devices.tablet) {
    deviceObj.isTabletDevice = true;
  } else if (devices.phone) {
    deviceObj.isMobileDevice = true;
  }

  return deviceObj;
}

/**
 * enableMobileNativeScaling for phone/tablet, enable native scale
 * @param  {[object]} devices
 */
function enableMobileNativeScaling(devices) {
  if (_env2.default.is_client && !getDevice(devices).isDesktopDevice) {
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1');
  }
}

/**
 * disableMobileNativeScaling for phone/tablet, disable native scale
 * @param  {[object]} devices
 */
function disableMobileNativeScaling(devices) {
  if (_env2.default.is_client && !getDevice(devices).isDesktopDevice) {
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, initial-scale=1');
  }
}

module.exports = {
  MediaSize: MediaSize,
  Media: Media,
  OS: OS,
  getMediaFromDevicesInfo: getMediaFromDevicesInfo,
  getBrowserMediaInfo: getBrowserMediaInfo,
  isBrowseBaseOnWebkit: isBrowseBaseOnWebkit,
  isEdgeBrowser: isEdgeBrowser,
  isOperatingSystem: isOperatingSystem,
  getScrollBarWidth: getScrollBarWidth,
  getDevice: getDevice,
  getScreen: getScreen,
  getScreenMediaInfo: getScreenMediaInfo,
  enableMobileNativeScaling: enableMobileNativeScaling,
  disableMobileNativeScaling: disableMobileNativeScaling
};