import { Meteor } from 'meteor/meteor';
import Future from 'fibers/future';
import oss from './oss';

Meteor.methods({
  up(id) {
    return Cards.update({_id: id}, {$inc: {up: 1}});
  },
  down(id) {
    return Cards.update({_id: id}, {$inc: {down: 1}});
  },
  sendStats({ type, platform }) {
    check(type, String);
    check(platform, String);
    const data = {
      type,
      platform,
      createdAt: new Date(),
    }
    return Stats.insert(data);
  },
  ossPutObject(args) {
    var future = new Future();
    var prefix = args.image.substr(0, args.image.indexOf("base64") + 7);
    var ext = "jpg";
    var mine = "image/jpeg";
    if (prefix.indexOf("png") > 0) {
        ext = "png";
        mine = "image/png";
    } else if (prefix.indexOf("gif") > 0) {
        ext = "gif";
        mine = "image/gif";
    }

    var name = args.Prefix + parseInt(Math.random() * 10000000000) + "." + ext;
    // console.log(name)
    var data = args.image.replace(/^data:image\/\w+;base64,/, "");
    var base64 = new Buffer(data, "base64");

    oss.putObject({
      Bucket: args.Bucket,
      Key: name,
      Body: base64,
      AccessControlAllowOrigin: '*',
      ContentType: mine,
      CacheControl: 'max-age=2592000', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
      ContentDisposition: '', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
      ContentEncoding: 'utf-8', // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
      ServerSideEncryption: 'AES256',
      Expires: null // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
    },
    function(err, data) {
      if (err) {
        console.log('error:', err);
        return;
      }
      data.url = "http://image.fami2u.com/" + name;
      // console.log('success:', data);
      future["return"](data)
    });
    return future.wait();
  },
});
