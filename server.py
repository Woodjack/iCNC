import os
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import ast
import cnc



port = int(os.environ.get('PORT', '80'))
from tornado.options import define, options
define("port", default=port, help="run on the given port", type=int) #port options for webServer




class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/ws", websocketHandler),
            (r"/", indexhtmlhandler),
        ]
        tornado.web.Application.__init__(self, handlers, debug=True)



##HTML handler
##
class indexhtmlhandler(tornado.web.RequestHandler):
    def get(self):
        self.render("web/index.html")


##Web Socket Connection
##
class websocketHandler(tornado.websocket.WebSocketHandler):
    
    def open(self):
        print 'connection openned'
        self.id = cookies.bakeCookie()
        self.clients.append(self)
        print 'new connection id= ', self.id
        self.write_message("Connected")
      
    def on_message(self, message):
        message = ast.literal_eval(message)
        print message

        if message['action'] == 'moveX':
            print "move X to ", message['data']
        
        elif message['action'] =='moveY':
            print "move Y to ", message['data']

        elif message['action'] =='updateStepping':
            print "microStepping now ", message['data']

        elif message['action'] =='zeroX':
            print "zero X "

        elif message['action'] =='zeroY':
            print "zero Y "

    def on_close(self):
        print 'connection closed'




## Main
##
if __name__ == "__main__":
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

