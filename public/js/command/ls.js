function Ls() {

  init();

  function init() {
    $(document).bind("Ls.Init", onCommandInit);
  }

  function onCommandInit() {
    var dir = [
        "How.I.Met.Your.Mother.S01E01.I.am.joking.got.you.mp4.torrent"
      , "node-v0.6.12.pkg"
      , "porn"
      , "me.jpg"
      , "index.js"
    ];
    var string ='';
    for (var i = 0; i < dir.length; i++) {
      string += dir[i] + '<br />';
    }
    $("#terminal").append(string + "<br />");
    $(".command").val("");
  }
}