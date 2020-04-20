class userDeviceInfo {
    constructor(userCode, deviceCode, verificationUrl) {
      this.userCode = userCode;
      this.deviceCode = deviceCode;
      this.verificationUrl = verificationUrl;
      this.isFinished = false;
      this.createdAt = new Date();
    }
  }
  
  module.exports = userDeviceInfo;