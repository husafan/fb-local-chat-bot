'use strict';

var _ChatUtils = require('./ChatUtils');

var _ChatUtils2 = _interopRequireDefault(_ChatUtils);

var _express = require('express');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _dot = require('dot');

var _dot2 = _interopRequireDefault(_dot);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FBLocalChatRoutes = function FBLocalChatRoutes(router, Bot) {
  router.get('/localChat/getMessages', function (req, res) {
    res.json(_ChatUtils2.default.getLocalChatMessages());
  });

  router.post('/localChat/sendMessage', function (req, res) {
    var senderID = req.body.senderID;
    var message = req.body.message;
    (0, _invariant2.default)(senderID && message, 'both senderID and message are required');

    _ChatUtils2.default.saveSenderMessageToLocalChat(senderID, message);
    var event = {
      sender: { id: senderID },
      recipient: { id: 'pageID' },
      timestamp: Math.floor(new Date() / 1000),
      message: {
        text: message
      }
    };
    Bot.emit('text', event);
    res.sendStatus(200);
  });

  router.post('/localChat/optin/', function (req, res) {
    var senderID = req.body.senderID;
    var ref = req.body.ref;

    (0, _invariant2.default)(senderID && ref, 'both senderID and payload are required');
    var event = {
      sender: { id: senderID },
      recipient: { id: 'pageID' },
      timestamp: Math.floor(new Date() / 1000),
      optin: {
        ref: ref
      }
    };
    Bot.emit('optin', event);
    res.sendStatus(200);
  });

  router.post('/localChat/postback/', function (req, res) {
    var senderID = req.body.senderID;
    var payload = req.body.payload;

    (0, _invariant2.default)(senderID && payload, 'both senderID and payload are required');
    var event = {
      sender: { id: senderID },
      recipient: { id: 'pageID' },
      timestamp: Math.floor(new Date() / 1000),
      postback: {
        payload: payload
      }
    };
    Bot.emit('postback', event);
    res.sendStatus(200);
  });

  router.post('/localChat/quickReply/', function (req, res) {
    var senderID = req.body.senderID;
    var payload = req.body.payload;
    var text = req.body.text;

    (0, _invariant2.default)(senderID && payload, 'both senderID and payload are required');
    var event = {
      sender: { id: senderID },
      recipient: { id: 'pageID' },
      timestamp: Math.floor(new Date() / 1000),
      message: {
        text: text,
        quick_reply: {
          payload: payload
        }
      }
    };
    Bot.emit('quick_reply', event);
    res.sendStatus(200);
  });

  router.get('/localChat/*', function (req, res) {
    var dir = _path2.default.join(_path2.default.dirname(__filename), '..', 'localChatWeb');
    var filePath = req.url.replace('/localChat', '');
    if (filePath !== '/') {
      res.sendFile(filePath, { root: dir });
      return;
    }
    var baseURL = req.baseUrl;

    // return html
    _fs2.default.readFile(dir + '/index.html', 'utf8', function (err, data) {
      console.log(err);
      if (err) {
        res.send('ERROR');
        return;
      }
      var tempFn = _dot2.default.template(data);
      res.send(tempFn({ baseURL: baseURL }));
    });
  });

  return router;
};

module.exports = FBLocalChatRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GQkxvY2FsQ2hhdFJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTs7QUFFQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBQyxNQUFELEVBQWlCLEdBQWpCLEVBQXlDO0FBQ2pFLFNBQU8sR0FBUCxDQUFXLHdCQUFYLEVBQXFDLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNqRCxRQUFJLElBQUosQ0FBUyxvQkFBVSxvQkFBVixFQUFUO0FBQ0QsR0FGRDs7QUFJQSxTQUFPLElBQVAsQ0FBWSx3QkFBWixFQUFzQyxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDbEQsUUFBTSxXQUFXLElBQUksSUFBSixDQUFTLFFBQTFCO0FBQ0EsUUFBTSxVQUFVLElBQUksSUFBSixDQUFTLE9BQXpCO0FBQ0EsNkJBQVUsWUFBWSxPQUF0QixFQUErQix3Q0FBL0I7O0FBRUEsd0JBQVUsNEJBQVYsQ0FBdUMsUUFBdkMsRUFBaUQsT0FBakQ7QUFDQSxRQUFNLFFBQVE7QUFDWixjQUFRLEVBQUMsSUFBSSxRQUFMLEVBREk7QUFFWixpQkFBVyxFQUFDLElBQUksUUFBTCxFQUZDO0FBR1osaUJBQVcsS0FBSyxLQUFMLENBQVcsSUFBSSxJQUFKLEtBQWEsSUFBeEIsQ0FIQztBQUlaLGVBQVM7QUFDUCxjQUFNO0FBREM7QUFKRyxLQUFkO0FBUUEsUUFBSSxJQUFKLENBQVMsTUFBVCxFQUFpQixLQUFqQjtBQUNBLFFBQUksVUFBSixDQUFlLEdBQWY7QUFDRCxHQWhCRDs7QUFrQkEsU0FBTyxJQUFQLENBQVksbUJBQVosRUFBaUMsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQzdDLFFBQU0sV0FBVyxJQUFJLElBQUosQ0FBUyxRQUExQjtBQUNBLFFBQU0sTUFBTSxJQUFJLElBQUosQ0FBUyxHQUFyQjs7QUFFQSw2QkFBVSxZQUFZLEdBQXRCLEVBQTJC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LCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBDaGF0VXRpbHMgZnJvbSAnLi9DaGF0VXRpbHMnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBkb3QgZnJvbSAnZG90JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBGQkxvY2FsQ2hhdFJvdXRlcyA9IChyb3V0ZXI6IFJvdXRlciwgQm90OiBPYmplY3QpOiBSb3V0ZXIgPT4ge1xuICByb3V0ZXIuZ2V0KCcvbG9jYWxDaGF0L2dldE1lc3NhZ2VzJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLmpzb24oQ2hhdFV0aWxzLmdldExvY2FsQ2hhdE1lc3NhZ2VzKCkpO1xuICB9KTtcblxuICByb3V0ZXIucG9zdCgnL2xvY2FsQ2hhdC9zZW5kTWVzc2FnZScsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHNlbmRlcklEID0gcmVxLmJvZHkuc2VuZGVySUQ7XG4gICAgY29uc3QgbWVzc2FnZSA9IHJlcS5ib2R5Lm1lc3NhZ2U7XG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIG1lc3NhZ2UsICdib3RoIHNlbmRlcklEIGFuZCBtZXNzYWdlIGFyZSByZXF1aXJlZCcpO1xuXG4gICAgQ2hhdFV0aWxzLnNhdmVTZW5kZXJNZXNzYWdlVG9Mb2NhbENoYXQoc2VuZGVySUQsIG1lc3NhZ2UpO1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgc2VuZGVyOiB7aWQ6IHNlbmRlcklEfSxcbiAgICAgIHJlY2lwaWVudDoge2lkOiAncGFnZUlEJ30sXG4gICAgICB0aW1lc3RhbXA6IE1hdGguZmxvb3IobmV3IERhdGUoKSAvIDEwMDApLFxuICAgICAgbWVzc2FnZToge1xuICAgICAgICB0ZXh0OiBtZXNzYWdlLFxuICAgICAgfSxcbiAgICB9O1xuICAgIEJvdC5lbWl0KCd0ZXh0JywgZXZlbnQpO1xuICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L29wdGluLycsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHNlbmRlcklEID0gcmVxLmJvZHkuc2VuZGVySUQ7XG4gICAgY29uc3QgcmVmID0gcmVxLmJvZHkucmVmO1xuXG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIHJlZiwgJ2JvdGggc2VuZGVySUQgYW5kIHBheWxvYWQgYXJlIHJlcXVpcmVkJyk7XG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICBzZW5kZXI6IHtpZDogc2VuZGVySUR9LFxuICAgICAgcmVjaXBpZW50OiB7aWQ6ICdwYWdlSUQnfSxcbiAgICAgIHRpbWVzdGFtcDogTWF0aC5mbG9vcihuZXcgRGF0ZSgpIC8gMTAwMCksXG4gICAgICBvcHRpbjoge1xuICAgICAgICByZWY6IHJlZixcbiAgICAgIH0sXG4gICAgfTtcbiAgICBCb3QuZW1pdCgnb3B0aW4nLCBldmVudCk7XG4gICAgcmVzLnNlbmRTdGF0dXMoMjAwKTtcbiAgfSk7XG5cbiAgcm91dGVyLnBvc3QoJy9sb2NhbENoYXQvcG9zdGJhY2svJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCBwYXlsb2FkID0gcmVxLmJvZHkucGF5bG9hZDtcblxuICAgIGludmFyaWFudChzZW5kZXJJRCAmJiBwYXlsb2FkLCAnYm90aCBzZW5kZXJJRCBhbmQgcGF5bG9hZCBhcmUgcmVxdWlyZWQnKTtcbiAgICBjb25zdCBldmVudCA9IHtcbiAgICAgIHNlbmRlcjoge2lkOiBzZW5kZXJJRH0sXG4gICAgICByZWNpcGllbnQ6IHtpZDogJ3BhZ2VJRCd9LFxuICAgICAgdGltZXN0YW1wOiBNYXRoLmZsb29yKG5ldyBEYXRlKCkgLyAxMDAwKSxcbiAgICAgIHBvc3RiYWNrOiB7XG4gICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICB9LFxuICAgIH07XG4gICAgQm90LmVtaXQoJ3Bvc3RiYWNrJywgZXZlbnQpO1xuICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gIH0pO1xuXG4gIHJvdXRlci5wb3N0KCcvbG9jYWxDaGF0L3F1aWNrUmVwbHkvJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGVySUQgPSByZXEuYm9keS5zZW5kZXJJRDtcbiAgICBjb25zdCBwYXlsb2FkID0gcmVxLmJvZHkucGF5bG9hZDtcbiAgICBjb25zdCB0ZXh0ID0gcmVxLmJvZHkudGV4dFxuXG4gICAgaW52YXJpYW50KHNlbmRlcklEICYmIHBheWxvYWQsICdib3RoIHNlbmRlcklEIGFuZCBwYXlsb2FkIGFyZSByZXF1aXJlZCcpO1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAgc2VuZGVyOiB7aWQ6IHNlbmRlcklEfSxcbiAgICAgIHJlY2lwaWVudDoge2lkOiAncGFnZUlEJ30sXG4gICAgICB0aW1lc3RhbXA6IE1hdGguZmxvb3IobmV3IERhdGUoKSAvIDEwMDApLFxuICAgICAgbWVzc2FnZToge1xuICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICBxdWlja19yZXBseToge1xuICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICAgIEJvdC5lbWl0KCdxdWlja19yZXBseScsIGV2ZW50KTtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICB9KTtcblxuICByb3V0ZXIuZ2V0KCcvbG9jYWxDaGF0LyonLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBkaXIgPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpLCAnLi4nLCAnbG9jYWxDaGF0V2ViJyk7XG4gICAgdmFyIGZpbGVQYXRoID0gcmVxLnVybC5yZXBsYWNlKCcvbG9jYWxDaGF0JywgJycpO1xuICAgIGlmIChmaWxlUGF0aCAhPT0gJy8nKSB7XG4gICAgICByZXMuc2VuZEZpbGUoZmlsZVBhdGgsIHtyb290OiBkaXJ9KTtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBiYXNlVVJMID0gcmVxLmJhc2VVcmw7XG5cbiAgICAvLyByZXR1cm4gaHRtbFxuICAgIGZzLnJlYWRGaWxlKGRpciArICcvaW5kZXguaHRtbCcsICd1dGY4JywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmVzLnNlbmQoJ0VSUk9SJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciB0ZW1wRm4gPSBkb3QudGVtcGxhdGUoZGF0YSk7XG4gICAgICByZXMuc2VuZCh0ZW1wRm4oe2Jhc2VVUkx9KSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiByb3V0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRkJMb2NhbENoYXRSb3V0ZXM7XG4iXX0=