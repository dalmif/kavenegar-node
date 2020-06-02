var https = require('https');
var querystring = require('querystring');
var KavenegarApi = function(options) {
	this.options = {};
	this.options.host = 'api.kavenegar.com';
	this.options.version = 'v1';
	this.options.apikey = options.apikey;
};
KavenegarApi.prototype.request = function(action, method, params,arrayCoding = false) {
  let ctx = this
  return new Promise(function(resolve, reject) {
    var path = '/' + ctx.options.version + '/' + ctx.options.apikey + '/' + action + '/' + method + '.json';
    if (arrayCoding) {
      var postdata = ctx.encodeArrayData(params)
    }
    else {
      var postdata = querystring.stringify(params);
    }
    var post_options = {
      host: ctx.options.host,
      port: '443',
      path: path,
      method: 'POST',
      headers: {
        'Content-Length': postdata.length,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      }
    };
    var req = https.request(post_options, function(e) {
      e.setEncoding('utf8');
      var result = '';
      e.on('data', function(data) {
        result += data;
      });
      e.on('end',function () {
        try {
          var jsonObject = JSON.parse(result);
          resolve({
              response:jsonObject.entries,
              status:jsonObject.return.status,
              message:jsonObject.return.message
            }
          );
        } catch (e){
          console.log('Exception!',e);
            resolve({response:[],status:500,message:e.message})

        }
      })
    });
    req.write(postdata, "utf8");
    req.on("error", function(e) {
      resolve(JSON.stringify({
        error: e.message
      }));
    });
    req.end();
  });
};
KavenegarApi.prototype.encodeArrayData = function (obj) {
  return Object.keys(obj).map(k => {
    const isArr = Array.isArray(obj[k])
    let o = ''
    if (isArr) {
      o = '[' + obj[k].map(x => '"' + x + '"') + ']'
    }
    else {
      if (typeof obj[k] == 'string') {
        o = '"' + obj[k] + '"'
      }
      else {
        o = obj[k]
      }
    }
    return `${encodeURIComponent(k)}=${encodeURIComponent(o)}`
  }).join('&');
}
KavenegarApi.prototype.Send = function(data) {
	return this.request("sms", "send", data);
};
KavenegarApi.prototype.SendArray = function(data) {
	return this.request("sms", "sendarray", data,true);
};
KavenegarApi.prototype.Status = function(data) {
  return this.request("sms", "status", data);
};
KavenegarApi.prototype.StatusLocalMessageid = function(data) {
	return this.request("sms", "statuslocalmessageid", data);
};
KavenegarApi.prototype.Select = function(data) {
  return this.request("sms", "select", data);
};
KavenegarApi.prototype.SelectOutbox = function(data) {
  return this.request("sms", "selectoutbox", data);
};
KavenegarApi.prototype.LatestOutbox = function(data) {
  return this.request("sms", "latestoutbox", data);
};
KavenegarApi.prototype.CountOutbox = function(data) {
  return this.request("sms", "countoutbox", data);
};
KavenegarApi.prototype.Cancel = function(data) {
	this.request("sms", "cancel", data);
};
KavenegarApi.prototype.Receive = function(data) {
  return this.request("sms", "receive", data);
};
KavenegarApi.prototype.CountInbox = function(data) {
  return this.request("sms", "countinbox", data);
};
KavenegarApi.prototype.CountPostalCode = function(data) {
  return this.request("sms", "countpostalcode", data);
};
KavenegarApi.prototype.SendByPostalCode = function(data) {
  return this.request("sms", "sendbypostalcode", data);
};
KavenegarApi.prototype.VerifyLookup = function(data) {
	return this.request("verify", "lookup", data);
};
KavenegarApi.prototype.AccountInfo = function(data) {
  return this.request("account", "info", data);
};
KavenegarApi.prototype.AccountConfig = function(data) {
  return this.request("account", "config", data);
};
KavenegarApi.prototype.CallMakeTTS = function(data) {
  return this.request("call", "maketts", data);
};

module.exports.KavenegarApi = function (options) {
	var obj = new KavenegarApi(options);
	return obj;
}
