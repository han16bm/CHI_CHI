// Nhạc nền không lời, tự sinh bằng Web Audio API — không dùng tệp nhạc nào.
// "Kẹo bông hồng" (giao diện sáng) và "Dải Ngân Hà" (giao diện tối).
const Music = (() => {
  let ctx, master, reverbIn, meter, timer = 0, on = false, scene = "light";
  const buses = {};
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function impulse(seconds, decay) {
    const len = ctx.sampleRate * seconds, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function setup() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3;
    master = ctx.createGain(); master.gain.value = 0;
    master.connect(comp).connect(ctx.destination);
    meter = ctx.createAnalyser(); meter.fftSize = 2048; comp.connect(meter);
    const verb = ctx.createConvolver(); verb.buffer = impulse(4.2, 2.6);
    reverbIn = ctx.createGain(); reverbIn.gain.value = 1;
    const verbOut = ctx.createGain(); verbOut.gain.value = 0.55;
    reverbIn.connect(verb).connect(verbOut).connect(master);
    for (const name of ["light", "dark"]) {
      const g = ctx.createGain(); g.gain.value = 0;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = name === "light" ? 5200 : 2600;
      g.connect(lp).connect(master);
      buses[name] = { in: g, filter: lp };
    }
    // Bộ lọc của "Dải Ngân Hà" mở/đóng rất chậm như hơi thở
    const lfo = ctx.createOscillator(), lfoAmt = ctx.createGain();
    lfo.frequency.value = 0.045; lfoAmt.gain.value = 900;
    lfo.connect(lfoAmt).connect(buses.dark.filter.frequency); lfo.start();
  }

  // Một nốt: nhiều dao động (partials), bao âm (attack/decay), độ vang và vị trí trái/phải
  function note({ m, t, dur = 1, hold = 0.2, gain = 0.05, type = "sine", partials = [[1, 1]], attack = 0.01, release = 0.8, verb = 0.3, pan = 0, detune = 0, bus }) {
    const env = ctx.createGain(), p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(gain, t + attack);
    env.gain.setTargetAtTime(0, t + attack + dur * hold, release / 3);
    let out = env;
    if (p) { p.pan.value = pan; env.connect(p); out = p; }
    out.connect(buses[bus].in);
    const send = ctx.createGain(); send.gain.value = verb; out.connect(send).connect(reverbIn);
    const stop = t + attack + dur * hold + release * 2.5;
    for (const [mult, amp] of partials) {
      const o = ctx.createOscillator(), a = ctx.createGain();
      o.type = type; o.frequency.value = mtof(m) * mult; o.detune.value = detune;
      a.gain.value = amp; o.connect(a).connect(env);
      o.start(t); o.stop(stop);
    }
  }

  // ---------- Kẹo bông hồng: Fa trưởng, 84 nhịp/phút ----------
  const PINK = {
    bpm: 84,
    chords: [[53, 57, 60, 65], [50, 57, 62, 65], [46, 58, 62, 65], [48, 55, 60, 64]], // F – Dm – Bb – C
    melody: [
      81, null, 84, 81, 77, 79, 81, null, 82, null, 81, 77, 79, null, 76, null,
      84, null, 81, 84, 86, null, 84, 81, 82, 81, 79, 77, 79, null, null, null,
    ],
  };
  function pinkTick(s, t) {
    const beatLen = 60 / PINK.bpm, eighth = s.step % 8, beat = Math.floor(s.step / 2), bar = Math.floor(beat / 4);
    const c = PINK.chords[bar % 4];
    if (s.step % 8 === 0) { // đầu ô nhịp: pad + bass
      for (const m of c.slice(1)) note({ m, t, dur: beatLen * 4, hold: 0.85, gain: 0.018, type: "triangle", attack: 0.5, release: 1.2, verb: 0.4, bus: "light" });
      note({ m: c[0] - 12, t, dur: beatLen * 2, gain: 0.07, attack: 0.03, release: 0.9, verb: 0.1, bus: "light" });
    }
    if (s.step % 8 === 4) note({ m: c[0] - 12, t, dur: beatLen * 2, gain: 0.05, attack: 0.03, release: 0.9, verb: 0.1, bus: "light" });
    // hộp nhạc rải hợp âm (móc đơn)
    const tones = [c[1] + 12, c[2] + 12, c[3] + 12, c[1] + 24];
    const m = tones[[0, 1, 2, 3, 2, 1, 2, 3][eighth]];
    note({ m, t, dur: 0.2, gain: 0.032, partials: [[1, 1], [2, 0.35], [3, 0.12]], attack: 0.005, release: 1.1, verb: 0.35, pan: eighth % 2 ? 0.35 : -0.35, bus: "light" });
    // giai điệu (nốt đen), nghỉ một vòng sau mỗi hai vòng cho đỡ lặp
    const cycle = Math.floor(bar / 8);
    if (s.step % 2 === 0 && cycle % 3 !== 2) {
      const mel = PINK.melody[beat % 32];
      if (mel) note({ m: mel, t, dur: beatLen * 0.9, gain: 0.05, partials: [[1, 1], [2, 0.2], [4, 0.05]], attack: 0.015, release: 1.3, verb: 0.45, bus: "light" });
    }
    if (Math.random() < 0.05) note({ m: 96 + [0, 2, 4, 7, 9][(Math.random() * 5) | 0], t, dur: 0.1, gain: 0.012, release: 1.5, verb: 0.8, pan: Math.random() * 1.4 - 0.7, bus: "light" });
    return beatLen / 2;
  }

  // ---------- Dải Ngân Hà: Rê, 62 nhịp/phút, đổi hợp âm mỗi 2 ô nhịp ----------
  const STAR = {
    bpm: 62,
    chords: [[38, 54, 57, 61, 64], [35, 50, 54, 57, 61], [31, 50, 54, 59, 61], [33, 52, 57, 59, 64]], // Dmaj9 – Bm9 – Gmaj7♯11 – A6/9
    twinkle: [74, 76, 78, 81, 83, 86, 88, 90, 93],
  };
  function starTick(s, t) {
    const beatLen = 60 / STAR.bpm, beat = Math.floor(s.step / 2), bar = Math.floor(beat / 4);
    const c = STAR.chords[Math.floor(bar / 2) % 4];
    if (s.step % 16 === 0) { // mỗi 2 ô nhịp: pad dày + tiếng trầm
      const len = beatLen * 8;
      for (const m of c.slice(1)) {
        note({ m, t, dur: len, gain: 0.011, type: "sawtooth", detune: -7, hold: 0.85, attack: 2.2, release: 3.2, verb: 0.6, pan: -0.25, bus: "dark" });
        note({ m, t, dur: len, gain: 0.011, type: "sawtooth", detune: 7, hold: 0.85, attack: 2.2, release: 3.2, verb: 0.6, pan: 0.25, bus: "dark" });
      }
      note({ m: c[0], t, dur: len, hold: 0.85, gain: 0.085, attack: 2, release: 3, verb: 0.2, bus: "dark" });
      note({ m: c[4] + 24, t: t + beatLen * 2, dur: 0.3, gain: 0.022, partials: [[1, 1], [3, 0.2]], release: 3, verb: 0.85, bus: "dark" });
    }
    if (Math.random() < 0.24) { // sao lấp lánh
      const m = STAR.twinkle[(Math.random() * STAR.twinkle.length) | 0];
      note({ m, t: t + Math.random() * 0.08, dur: 0.15, gain: 0.03, partials: [[1, 1], [2, 0.15]], release: 2.4, verb: 0.75, pan: Math.random() * 1.6 - 0.8, bus: "dark" });
    }
    return beatLen / 2;
  }

  const SCENES = { light: { tick: pinkTick, title: "Kẹo bông hồng" }, dark: { tick: starTick, title: "Dải Ngân Hà" } };
  const state = { light: { step: 0, next: 0 }, dark: { step: 0, next: 0 } };

  function schedule() {
    const s = state[scene], ahead = ctx.currentTime + 0.25;
    if (s.next < ctx.currentTime) s.next = ctx.currentTime + 0.05;
    while (s.next < ahead) { const d = SCENES[scene].tick(s, s.next); s.step++; s.next += d; }
  }

  function fadeBus(name, to, secs) {
    const g = buses[name].in.gain, now = ctx.currentTime;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(to, now + secs);
  }

  return {
    get on() { return on; },
    get title() { return SCENES[scene].title; },
    start(theme) {
      if (!ctx) setup();
      scene = theme === "dark" ? "dark" : "light";
      ctx.resume();
      on = true;
      fadeBus(scene, 1, 0.1);
      fadeBus(scene === "dark" ? "light" : "dark", 0, 0.1);
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(1.1, now + 2.5);
      clearInterval(timer); timer = setInterval(schedule, 90); schedule();
    },
    stop() {
      if (!ctx || !on) return;
      on = false;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 1.2);
      clearInterval(timer);
      setTimeout(() => { if (!on) ctx.suspend(); }, 1400);
    },
    // Đổi bản nhạc theo giao diện: bản cũ nhỏ dần, bản mới to dần
    setScene(theme) {
      const next = theme === "dark" ? "dark" : "light";
      if (next === scene) return;
      const prev = scene; scene = next;
      if (!ctx || !on) return;
      state[next].next = ctx.currentTime + 0.1;
      fadeBus(prev, 0, 2.5);
      fadeBus(next, 1, 2.5);
    },
    // Mức âm lượng hiện tại (RMS, đỉnh) — dùng để kiểm tra
    level() {
      if (!meter) return { rms: 0, peak: 0 };
      const d = new Float32Array(meter.fftSize); meter.getFloatTimeDomainData(d);
      let sum = 0, peak = 0; for (const v of d) { sum += v * v; peak = Math.max(peak, Math.abs(v)); }
      return { rms: Math.sqrt(sum / d.length), peak };
    },
    get scene() { return scene; },
    pause() { if (ctx && on) ctx.suspend(); },
    resume() { if (ctx && on) ctx.resume(); },
  };
})();
