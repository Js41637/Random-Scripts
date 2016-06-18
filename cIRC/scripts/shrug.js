setName('/shrug');
setDescription('/shrug [your message] - Appends ¯\\_(ツ)_/¯ to your message');

send('hook_command', 'shrug');

var shrug = "¯\\_(ツ)_/¯ ";
this.onMessage = function(e) {
  send(e.context, 'command', 'say', shrug + e.args.join(' '));
  propagate(e, 'none');
};
