// import EventEmitter from 'events'
const { ipcRenderer } = window.require("electron");
// let peer = new EventEmitter()
// window.peer = peer // 为了直接模拟过程，信令结束后，会删掉

ipcRenderer.on("offer", (e, offer) => {
  console.log("init pc", offer);
  const pc = new window.RTCPeerConnection();

  pc.ondatachannel = (e) => {
    console.log("data", e);
    e.channel.onmessage = (e) => {
      console.log("onmessage", e, JSON.parse(e.data));
      let { type, data } = JSON.parse(e.data);
      console.log("robot", type, data);
      if (type === "mouse") {
        data.screen = {
          width: window.screen.width,
          height: window.screen.height,
        };
      }
      ipcRenderer.send("robot", type, data);
    };
  };

  async function getScreenStream() {
    const sourceId = await ipcRenderer.invoke("getScreen");
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height,
          minWidth: 1280,
          minHeight: 720,
        },
      },
    });
    return stream;
  }

  pc.onicecandidate = (e) => {
    // 告知其他人
    ipcRenderer.send("forward", "puppet-candidate", JSON.stringify(e.candidate));
  };

  async function addIceCandidate(candidate) {
    if (!candidate) return;
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }
  window.addIceCandidate = addIceCandidate;

  async function createAnswer(offer) {
    let stream = await getScreenStream();
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });
    await pc.setRemoteDescription(offer);
    await pc.setLocalDescription(await pc.createAnswer());
    console.log("create answer \n", JSON.stringify(pc.localDescription));
    // send answer
    return pc.localDescription;
  }
  createAnswer(offer).then((answer) => {
    ipcRenderer.send("forward", "answer", {
      type: answer.type,
      sdp: answer.sdp,
    });
  });
});

