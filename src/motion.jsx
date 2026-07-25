import { useEffect, useRef, useState } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ */
/* Reveal: visible by default, animates in once the observer confirms  */
/* ------------------------------------------------------------------ */

export function useReveal(options = {}) {
  const ref = useRef(null)
  const [state, setState] = useState('visible')

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window) || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setState('shown')
      return
    }
    setState('hidden')
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState('shown')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: options.threshold ?? 0.05 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, state]
}

export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const [ref, state] = useReveal()
  return (
    <Tag ref={ref} className={`rv rv-${state} ${className}`} style={{ '--rv-delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* SplitTitle: masked words/characters rising in sequence              */
/* ------------------------------------------------------------------ */

export function SplitTitle({ as: Tag = 'h1', text, className = '', id }) {
  const [ref, state] = useReveal()
  const cjk = /[一-鿿　-〿＀-￯]/.test(text)
  let parts
  if (cjk) {
    parts = []
    for (const ch of text) {
      if (parts.length && /[。，、：；！？）》』」…·—]/.test(ch)) parts[parts.length - 1] += ch
      else parts.push(ch)
    }
  } else {
    parts = text.split(/(\s+)/)
  }
  let index = 0
  return (
    <Tag ref={ref} id={id} className={`split-title st-${state} ${className}`} aria-label={text}>
      {parts.map((part, i) => {
        if (!cjk && /^\s+$/.test(part)) return ' '
        const el = (
          <span className="st-mask" key={i} aria-hidden="true">
            <span className="st-word" style={{ '--st-i': index }}>{part}</span>
          </span>
        )
        index += 1
        return el
      })}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* CountUp                                                             */
/* ------------------------------------------------------------------ */

export function CountUp({ value, duration = 1600, className = '' }) {
  const [ref, state] = useReveal()
  const [display, setDisplay] = useState(prefersReducedMotion() ? value : 0)
  const started = useRef(false)

  useEffect(() => {
    if (state !== 'shown' && state !== 'visible') return
    if (started.current || prefersReducedMotion()) {
      setDisplay(value)
      return
    }
    started.current = true
    const from = value > 100 ? Math.floor(value * 0.72) : 0
    const t0 = performance.now()
    let frame
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setDisplay(Math.round(from + (value - from) * eased))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [state, value, duration])

  return <span ref={ref} className={className}>{display}</span>
}

/* ------------------------------------------------------------------ */
/* EnergyCanvas: live-rendered flowing energy field                    */
/* ------------------------------------------------------------------ */

export function EnergyCanvas({ density = 22, pulses: pulseCount = 6, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, frame = 0, t = 0
    let running = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = Math.max(1, w * dpr)
      canvas.height = Math.max(1, h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // Fewer lines and pulses on small screens — battery and GPU cost scale
    // with stroke count, and the effect reads fine at half density on mobile.
    const small = window.innerWidth < 700
    if (small) {
      density = Math.max(8, Math.round(density / 2))
      pulseCount = Math.max(2, Math.round(pulseCount / 2))
    }

    const rand = (a, b) => a + Math.random() * (b - a)
    const lines = Array.from({ length: density }, () => ({
      y: rand(0.06, 0.96),
      amp: rand(14, 64),
      freq: rand(0.55, 1.7),
      speed: rand(0.12, 0.5),
      phase: rand(0, Math.PI * 2),
      width: rand(0.5, 1.4),
      alpha: rand(0.05, 0.16),
    }))
    const pulses = Array.from({ length: pulseCount }, () => ({
      line: Math.floor(Math.random() * density),
      x: Math.random(),
      speed: rand(0.0016, 0.0042),
      size: rand(1.6, 3.2),
    }))

    const yAt = (l, x) =>
      h * l.y +
      Math.sin((x * l.freq) / 90 + l.phase + t * l.speed) * l.amp +
      Math.sin((x * l.freq) / 37 + l.phase * 1.7 + t * l.speed * 1.6) * l.amp * 0.35

    const drawFrame = () => {
      ctx.clearRect(0, 0, w, h)
      for (const l of lines) {
        ctx.beginPath()
        for (let x = -20; x <= w + 20; x += 16) {
          const y = yAt(l, x)
          x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(31, 111, 194, ${(l.alpha * 0.85).toFixed(3)})`
        ctx.lineWidth = l.width
        ctx.stroke()
      }
      for (const p of pulses) {
        const l = lines[p.line]
        const px = p.x * (w + 200) - 100
        const py = yAt(l, px)
        const g = ctx.createRadialGradient(px, py, 0, px, py, p.size * 14)
        g.addColorStop(0, 'rgba(31, 111, 194, .55)')
        g.addColorStop(0.25, 'rgba(46, 134, 212, .28)')
        g.addColorStop(1, 'rgba(46, 134, 212, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, p.size * 14, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(13, 58, 112, .85)'
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
        p.x += p.speed
        if (p.x > 1.05) {
          p.x = -0.05
          p.line = Math.floor(Math.random() * density)
        }
      }
    }

    const loop = () => {
      if (!running) return
      t += 0.016
      drawFrame()
      frame = requestAnimationFrame(loop)
    }

    resize()
    if (prefersReducedMotion()) {
      t = 20
      drawFrame() // single static frame
      return
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting)
      if (visible && !running) {
        running = true
        frame = requestAnimationFrame(loop)
      } else if (!visible) {
        running = false
        cancelAnimationFrame(frame)
      }
    })
    observer.observe(canvas)
    frame = requestAnimationFrame(loop)

    const onResize = () => resize()
    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(frame)
      } else if (!running) {
        running = true
        frame = requestAnimationFrame(loop)
      }
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [density, pulseCount])

  return <canvas ref={ref} className={`energy-canvas ${className}`} aria-hidden="true" />
}

/* ------------------------------------------------------------------ */
/* TwinCanvas: pseudo-3D digital-twin factory floor — rotating         */
/* wireframe hall with a scanning plane and rising telemetry sparks.   */

export function TwinCanvas({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, frame = 0, t = 0
    let running = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = Math.max(1, w * dpr)
      canvas.height = Math.max(1, h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const small = window.innerWidth < 700

    // Floor plan: production hall as wireframe cuboids on a grid.
    // [gx, gz, sx, sz, height] in grid units.
    const GX = 12, GZ = 7
    const boxes = [
      [1.2, 1.2, 2.4, 1.0, 0.55], [4.4, 1.2, 2.4, 1.0, 0.55], [7.6, 1.2, 2.4, 1.0, 0.55],
      [1.2, 3.1, 2.4, 1.0, 0.75], [4.4, 3.1, 2.4, 1.0, 0.75], [7.6, 3.1, 2.4, 1.0, 0.75],
      [10.4, 1.2, 0.9, 2.9, 1.7],
      [1.2, 5.0, 5.6, 0.8, 0.4],
      [8.0, 4.9, 2.0, 1.1, 1.05],
    ]
    const sparks = Array.from({ length: small ? 10 : 22 }, () => ({
      b: Math.floor(Math.random() * boxes.length),
      u: Math.random(), v: Math.random(),
      y: Math.random(), speed: 0.16 + Math.random() * 0.3,
    }))

    const tilt = 0.62
    const project = (x, yUp, z, yaw) => {
      const cx = x - GX / 2, cz = z - GZ / 2
      const rx = cx * Math.cos(yaw) - cz * Math.sin(yaw)
      const rz = cx * Math.sin(yaw) + cz * Math.cos(yaw)
      const ry = rz * Math.sin(tilt) - yUp * Math.cos(tilt)
      const depth = rz * Math.cos(tilt) + yUp * Math.sin(tilt)
      const persp = 1 / (1 + depth * 0.055)
      const scale = Math.min(w / 15.5, h / 8.4)
      return [w / 2 + rx * scale * persp, h * 0.52 + ry * scale * persp, persp]
    }

    const line = (a, b, color, width = 1) => {
      ctx.beginPath()
      ctx.moveTo(a[0], a[1])
      ctx.lineTo(b[0], b[1])
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.stroke()
    }

    const drawFrame = () => {
      ctx.clearRect(0, 0, w, h)
      const yaw = -0.35 + t * 0.085
      const scanX = ((t * 0.9) % (GX + 4)) - 2

      // floor grid
      for (let x = 0; x <= GX; x++) {
        const near = Math.max(0, 1 - Math.abs(x - scanX) / 1.6)
        line(project(x, 0, 0, yaw), project(x, 0, GZ, yaw),
          `rgba(120, 180, 240, ${(0.10 + near * 0.38).toFixed(3)})`, near > 0.4 ? 1.2 : 0.7)
      }
      for (let z = 0; z <= GZ; z++) {
        line(project(0, 0, z, yaw), project(GX, 0, z, yaw), 'rgba(120, 180, 240, 0.10)', 0.7)
      }

      // scan plane
      if (scanX >= 0 && scanX <= GX) {
        const p0 = project(scanX, 0, 0, yaw), p1 = project(scanX, 0, GZ, yaw)
        const p2 = project(scanX, 1.9, GZ, yaw), p3 = project(scanX, 1.9, 0, yaw)
        const g = ctx.createLinearGradient(p0[0], p0[1], p3[0], p3[1])
        g.addColorStop(0, 'rgba(86, 156, 226, 0.16)')
        g.addColorStop(1, 'rgba(86, 156, 226, 0)')
        ctx.beginPath()
        ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1])
        ctx.lineTo(p2[0], p2[1]); ctx.lineTo(p3[0], p3[1])
        ctx.closePath()
        ctx.fillStyle = g
        ctx.fill()
      }

      // machine cuboids
      for (const [gx, gz, sx, sz, bh] of boxes) {
        const near = Math.max(0, 1 - Math.abs(gx + sx / 2 - scanX) / 2.2)
        const edge = `rgba(140, 196, 248, ${(0.34 + near * 0.5).toFixed(3)})`
        const base = [[gx, gz], [gx + sx, gz], [gx + sx, gz + sz], [gx, gz + sz]]
        const lo = base.map(([x, z]) => project(x, 0, z, yaw))
        const hi = base.map(([x, z]) => project(x, bh, z, yaw))
        for (let i = 0; i < 4; i++) {
          line(lo[i], lo[(i + 1) % 4], edge, 1)
          line(hi[i], hi[(i + 1) % 4], edge, 1.2)
          line(lo[i], hi[i], edge, 1)
        }
        // roof glow when scanned
        if (near > 0.25) {
          ctx.beginPath()
          ctx.moveTo(hi[0][0], hi[0][1])
          for (let i = 1; i < 4; i++) ctx.lineTo(hi[i][0], hi[i][1])
          ctx.closePath()
          ctx.fillStyle = `rgba(96, 168, 235, ${(near * 0.14).toFixed(3)})`
          ctx.fill()
        }
      }

      // telemetry sparks rising off machines
      for (const s of sparks) {
        const [gx, gz, sx, sz, bh] = boxes[s.b]
        s.y += s.speed * 0.016
        if (s.y > 1) { s.y = 0; s.u = Math.random(); s.v = Math.random(); s.b = Math.floor(Math.random() * boxes.length) }
        const p = project(gx + s.u * sx, bh + s.y * 1.6, gz + s.v * sz, yaw)
        const a = (1 - s.y) * 0.7
        ctx.fillStyle = `rgba(150, 205, 250, ${a.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p[0], p[1], 1.5 * p[2] + 0.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      if (!running) return
      t += 0.016
      drawFrame()
      frame = requestAnimationFrame(loop)
    }

    resize()
    if (prefersReducedMotion()) {
      t = 6
      drawFrame()
      return
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting)
      if (visible && !running) {
        running = true
        frame = requestAnimationFrame(loop)
      } else if (!visible) {
        running = false
        cancelAnimationFrame(frame)
      }
    })
    observer.observe(canvas)
    frame = requestAnimationFrame(loop)

    const onResize = () => resize()
    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(frame)
      } else if (!running) {
        running = true
        frame = requestAnimationFrame(loop)
      }
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} className={`twin-canvas ${className}`} aria-hidden="true" />
}

/* ------------------------------------------------------------------ */
/* GlobeCanvas: dot-matrix 3D globe — land as points, animated arcs    */
/* from the Hangzhou hub to export markets. Drag to spin.              */

/* 192x96 masks, one hex row per 192-bit scanline (equirectangular). */
const LAND_HEX =
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '0000000000003fff01fff800000000000000000000000000' +
  '000000000007ffffffffffc0000800f00000380000000000' +
  '0000000009ffffffffffff0007fe01f00000fe0000000000' +
  '00000000fdfffffffffffe0001fc0000080007c000000000' +
  '00000003ff7ffe3ffffffc0000c00007f803fff8007f8000' +
  '00000007fffffe007ffffc000000000f003fffff703b0000' +
  'c008000fffffffc03ffff8000000001c0ffffffffbff8000' +
  'c07ffcfffffffff03ffff800003fc00edfffffffffffffff' +
  'c1fffffffffffbfc1fffe00001fffdffffffffffffffffff' +
  'fffffffffffffbff1ffc1f8003ffffffffffffffffffffff' +
  'f9fffffffffffbfc0fe01f8007ffffffffffffffffffffff' +
  '0fffffffffff7ffc0fe006003fffffffffffffffffffffff' +
  '03fffffffffc07e407c000003ffffffffffffffffffffffc' +
  '01ffdffffffe03fe000000063fcfffffffffffffffffefa0' +
  '003e00ffffffc3ff0000000e1fffffffffffffffffe01f00' +
  '00f0007fffffffffc000001f0fffffffffffffffffc03e00' +
  '000000ffffffffffe000003fbffffffffffffffffff81c00' +
  '0000007fffffffffe000003ffffffffffffffffffff81800' +
  '0000001ffffffffff000000ffffffffffffffffffffc0000' +
  '00000007fffffffdf0000007fffffffffffffffffff80000' +
  '00000007ffffffff90000001ffffffffffffffffffd80000' +
  '00000007fffffffe0000001fffff6fffffffffffffbc0000' +
  '00000007ffffffe00000003fcfff77ffffffffffff380000' +
  '00000007ffffffc00000003fcdffffeffffffffffc300000' +
  '00000003ffffff800000003f8ffbffeffffffffff8300000' +
  '00000001ffffff000000001ffd9bffffffffffffddf00000' +
  '00000001ffffff000000000ffc0e7fffffffffff9fe00000' +
  '00000000fffffc040000003fffbc3fffffffffff87800000' +
  '000000007ffff8000000003fffffffffffffffffc6000000' +
  '000000003fffbc000000007fffffffffffffffffc0000000' +
  '000000003ff81e00000000ffffffffffffffffff80000000' +
  '000000000ff80e00000001fffffffff7ffffffffc0000000' +
  '000000000ff01e00000001ffffffffff1ffffffe80000000' +
  '0038000001f9ff80000003ffffffffff0ffffff880000000' +
  '000c000001f9c3f0000001fffffff7ff03fe7ff000000000' +
  '0000000000ffc3fc000001fffffffffe03f83fe0c0000000' +
  '00000000003ff000000001fffffffff801f03fe1c0000000' +
  '000000000003f000000003ffffffffe001e00fe0e0000000' +
  '00000000000070f0000001fffffffff001e00fe1e0000000' +
  '00000000000037ff000001fffffffff000e00fc170000000' +
  '0000000000001fff800000ffffffffe000f00d8370000000' +
  '0000000000000ffff000007fffffffe00030060770000000' +
  '00000000000003fff800003f3fffffc000003f0f20000000' +
  '00000000000003fffc00000007ffff8000001f3e08000000' +
  '00000000000007fffc0000000fffff0000000f3ff8000000' +
  '0000000000000fffff8000000ffffe000000073fcf400000' +
  '0000000000000ffffff0000007fffc00000007bfdff8c000' +
  '0000000000000ffffffc000007fffc0000000385d7fde000' +
  '0000000000000ffffffc000003fffc00000001f9417fb800' +
  '00000000000007fffffc000003fffc000000007ff07f0e00' +
  '00000000000003fffff8000003fffc0000000001e21b8600' +
  '00000000000003fffff0000001fffc200000000007d80000' +
  '00000000000001fffff0000003fffc60000000003f9c00c0' +
  '80000000000001fffff0000003fffde0000000007fdc00c1' +
  '000000000000007ffff0000003fff9e000000000fffc0003' +
  '000000000000003fffe0000003fff1e000000003ffff0180' +
  '000000000000003fffe0000001ffe1c00000000fffff81c0' +
  '000000000000003fffc0000001ffe1c00000000fffff8000' +
  '000000000000003ffe00000001ffe1c00000000fffffc000' +
  '000000000000003ffe00000000ffc0000000000fffffc000' +
  '000000000000007ffe00000000ffc00000000007ffffc000' +
  '000000000000007ffc000000007f800000000007ffffc000' +
  '000000000000007ff8000000007f000000000007fbffc000' +
  '000000000000007ff0000000007c000000000007c0ff8008' +
  '00000000000000ffc00000000000000000000000003f800c' +
  '00000000000000ffc00000000000000000000000001f000f' +
  '00000000000000fe0000000000000000000000000007001e' +
  '00000000000000fe0000000000000000000000000007003c' +
  '00000000000000fc00000000000000000000000000060078' +
  '00000000000001fc000000000000000000000000000000e0' +
  '00000000000001f800000000000000000800000000000000' +
  '00000000000001f000000000000000000c00000000000000' +
  '00000000000001f1c0000000000000000000000000000000' +
  '00000000000000f000000000000000000000000000000000' +
  '000000000000007c00000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '0000000000000000c0000000000000000000000000000000' +
  '0000000000000007c0000000000000000000020000800000' +
  '000000000000001e000000000000007f201ffffffffc0000' +
  '000000000000003e00000000000077fffc7ffffffffff000' +
  '00000000000000ff000000097fffffffffffffffffffffe0' +
  '0000000000f8a1ff000000fffffffffffffffffffffffff0' +
  '000007fffeffffff000001ffffffffffffffffffffffffe0' +
  '00007ffffffffffc0000ffffffffffffffffffffffffff00' +
  '00ffffffffffff80078fffffffffffffffffffffffffff80' +
  '0077ffffffffff8f9f8fffffffffffffffffffffffffffc0' +
  '000fffffffffffff9fffffffffffffffffffffffffffff00' +
  'be03fffffffffffffffffffffffffffffffffffffffffff4' +
  'ffffffffffffffffffffffffffffffffffffffffffffffff' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000'

/* Highlighted markets: China + the eight export countries. */
const HOT_HEX =
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000f00000380000000000' +
  '000000000000000000000000000001f00000fe0000000000' +
  '00000000000000000000000000000000080007c000000000' +
  '00000000000000000000000000000007f803fff8007f8000' +
  '0000000000000000000000000000000f003fffff703b0000' +
  'c000000000000000000000000000001c0ffffffffbff8000' +
  'c000000000000000000000000000c00edfffffffffffffff' +
  'c000000000000000000000000001fdffffffffffffffffff' +
  'fc00000000000000000000000001ffffffffffffffffffff' +
  'f800000000000000000000000001ffffffffffffffffffff' +
  '0000000000000000000000000000ffffffffffffffffffff' +
  '0000000000000000000000000003fffffffffffffffffffc' +
  '0000000000000000000000000003ffffffffffffffffefa0' +
  '0000000000000000000000000003ffffffffffffffe01f00' +
  '0000000000000000000000000039ffffffffffffffc03e00' +
  '0000000000000000000000000018ffffe5fffffffff81c00' +
  '000000000000000000000000000fffff803ffffffff81800' +
  '000000000000000000000000001fffc50007fbfffffc0000' +
  '000000000000000000000000001fffc0000f8007fff80000' +
  '0000000000000000000000000001ffe0001fc017ffd80000' +
  '00000000000000000000000000006fc0003ff01fff800000' +
  '000000000000000000000000000001c0007fffffff000000' +
  '0000000000000000000000000000004001fffffff0000000' +
  '0000000000000000000000000000000001ffffffd8000000' +
  '0000000000000000000000000000000003ffffffdc000000' +
  '0000000000000000000000000000000007ffffff98000000' +
  '000000000000000000000000000000000fffffff80000000' +
  '000000000000000000000000000000001f7fffffc0000000' +
  '00000000000000000000000000000000ff0fffffc0000000' +
  '000000000000000000000000000000007e03cfff80000000' +
  '00000000000000000000000000000000fc03cfff00000000' +
  '000000000000000000000000000000001c01cffe00000000' +
  '000000000000000000000000000000000001cef800000000' +
  '0000000000000000000000000000000000000e7000000000' +
  '0000000000000000000000000000000000001f60c0000000' +
  '0000000000000000000000000000000000000f81c0000000' +
  '0000000000000000000000000000000000000f80e0000000' +
  '0000000000000000000000000000000000000e01e0000000' +
  '0000000000000000000000038000000000000c0170000000' +
  '0000000000000000000000038000000000000c0370000000' +
  '000000000000000000000003800000000000060070000000' +
  '000000000000000000000003000000000000000020000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000070000000000000000000000000000000000' +
  '0000000000000f0000000000000000000000000000000000' +
  '0000000000000f0000000000000000000000000000000000' +
  '000000000000060000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000003000000000000000000000000000000000' +
  '000000000000003000000000000000000000000000000000' +
  '000000000000003000000000000000000000000000000000' +
  '000000000000003800000000000000000000000000000000' +
  '000000000000003000000000000000000000000000000000' +
  '000000000000003000000000000000000000000000000000' +
  '000000000000006000000000000000000000000000000000' +
  '000000000000006000000000000000000000000000000000' +
  '000000000000006000000000000000000000000000000000' +
  '000000000000006000000000000000000000000000000000' +
  '00000000000000e000000000000000000000000000000000' +
  '00000000000000e000000000000000000000000000000000' +
  '00000000000000c000000000000000000000000000000000' +
  '00000000000000c000000000000000000000000000000000' +
  '00000000000000e000000000000000000000000000000000' +
  '00000000000001c000000000000000000000000000000000' +
  '00000000000001c000000000000000000000000000000000' +
  '00000000000001c000000000000000000000000000000000' +
  '00000000000001f000000000000000000000000000000000' +
  '00000000000000f000000000000000000000000000000000' +
  '000000000000007800000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000' +
  '000000000000000000000000000000000000000000000000'

const GLOBE_GW = 192, GLOBE_GH = 96

function decodeLand(step) {
  const pts = []
  for (let gy = 0; gy < GLOBE_GH; gy += 1) {
    const row = LAND_HEX.slice(gy * 48, gy * 48 + 48)
    const hotRow = HOT_HEX.slice(gy * 48, gy * 48 + 48)
    for (let gx = 0; gx < GLOBE_GW; gx += step) {
      const nib = parseInt(row[gx >> 2], 16)
      if ((nib >> (3 - (gx & 3))) & 1) {
        const lat = 90 - ((gy + 0.5) * 180) / GLOBE_GH
        const lon = -180 + ((gx + 0.5) * 360) / GLOBE_GW
        if (lat < -78) continue // trim the Antarctic cap so the pole isn't a solid disc
        const isHot = (parseInt(hotRow[gx >> 2], 16) >> (3 - (gx & 3))) & 1
        pts.push([lat, lon, isHot]) // [.., highlighted-country flag]
      }
    }
  }
  return pts
}

const toVec = (lat, lon) => {
  const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180
  return [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)]
}
const slerp = (a, b, t) => {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const th = Math.acos(dot)
  if (th < 1e-4) return a
  const sa = Math.sin((1 - t) * th) / Math.sin(th), sb = Math.sin(t * th) / Math.sin(th)
  return [a[0] * sa + b[0] * sb, a[1] * sa + b[1] * sb, a[2] * sa + b[2] * sb]
}

export function GlobeCanvas({ hub, markets, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, frame = 0, t = 0
    let running = true
    let rot = -(120.16 * Math.PI) / 180 + Math.PI / 2 + 0.35 // China just left of centre
    let dragging = false, lastX = 0, spin = 0

    const small = window.innerWidth < 700
    const land = decodeLand(small ? 2 : 1)
    const tilt = 0.32
    const hubVec = toVec(hub[0], hub[1])
    const marketVecs = markets.map(([name, lat, lon]) => [name, toVec(lat, lon)])

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = Math.max(1, w * dpr)
      canvas.height = Math.max(1, h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const view = (v) => {
      // yaw
      const x = v[0] * Math.cos(rot) - v[2] * Math.sin(rot)
      const z = v[0] * Math.sin(rot) + v[2] * Math.cos(rot)
      // pitch
      const y = v[1] * Math.cos(tilt) - z * Math.sin(tilt)
      const zc = v[1] * Math.sin(tilt) + z * Math.cos(tilt)
      return [x, y, zc]
    }
    const R = () => Math.min(w * 0.42, h * 0.46)
    const sx = (x) => w * 0.5 - x * R() // mirrored: viewed from outside the globe
    const sy = (y) => h * 0.52 - y * R()

    const drawFrame = () => {
      ctx.clearRect(0, 0, w, h)
      const r = R()

      // sphere halo
      const halo = ctx.createRadialGradient(w * 0.5, h * 0.52, r * 0.72, w * 0.5, h * 0.52, r * 1.18)
      halo.addColorStop(0, 'rgba(52, 118, 190, 0)')
      halo.addColorStop(0.82, 'rgba(72, 142, 214, 0.12)')
      halo.addColorStop(1, 'rgba(72, 142, 214, 0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(w * 0.5, h * 0.52, r * 1.18, 0, Math.PI * 2)
      ctx.fill()

      // land dots
      for (const [lat, lon, isHot] of land) {
        const [x, y, zc] = view(toVec(lat, lon))
        if (zc < 0.02) continue
        const a = 0.2 + zc * (isHot ? 0.75 : 0.42)
        ctx.fillStyle = isHot
          ? `rgba(158, 210, 252, ${a.toFixed(3)})`
          : `rgba(112, 168, 226, ${a.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(sx(x), sy(y), (isHot ? 1.5 : 1.05) * (0.72 + zc * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }

      // arcs hub -> markets — per-segment alpha fades them out at the limb
      marketVecs.forEach(([, mv], mi) => {
        const steps = 44
        let prev = null
        for (let i = 0; i <= steps; i++) {
          const f = i / steps
          const p = slerp(hubVec, mv, f)
          const lift = 1 + Math.sin(Math.PI * f) * 0.22
          const [x, y, zc] = view([p[0] * lift, p[1] * lift, p[2] * lift])
          const cur = [sx(x), sy(y), zc]
          if (prev) {
            const a = Math.min(1, Math.max(0, (Math.min(prev[2], zc) - 0.06) * 2.2))
            if (a > 0.01) {
              ctx.beginPath()
              ctx.moveTo(prev[0], prev[1])
              ctx.lineTo(cur[0], cur[1])
              ctx.strokeStyle = `rgba(140, 196, 248, ${(a * 0.45).toFixed(3)})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
          prev = cur
        }

        // travelling pulse
        const f = ((t * 0.22 + mi * 0.13) % 1)
        const p = slerp(hubVec, mv, f)
        const lift = 1 + Math.sin(Math.PI * f) * 0.22
        const [x, y, zc] = view([p[0] * lift, p[1] * lift, p[2] * lift])
        if (zc > 0.2) {
          ctx.fillStyle = 'rgba(196, 228, 252, 0.95)'
          ctx.beginPath()
          ctx.arc(sx(x), sy(y), 1.8, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // market dots + labels
      ctx.font = '500 11px "DM Mono", monospace'
      ctx.textBaseline = 'middle'
      for (const [name, mv] of marketVecs) {
        const [x, y, zc] = view(mv)
        if (zc < 0.02) continue
        const px = sx(x), py = sy(y)
        const ring = (t * 0.9) % 1
        ctx.strokeStyle = `rgba(160, 210, 250, ${(0.5 * (1 - ring)).toFixed(3)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(px, py, 3 + ring * 9, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = 'rgba(196, 228, 252, 0.95)'
        ctx.beginPath()
        ctx.arc(px, py, 2.2, 0, Math.PI * 2)
        ctx.fill()
        if (!small && zc > 0.2) {
          ctx.fillStyle = `rgba(196, 224, 250, ${(zc * 0.9).toFixed(3)})`
          ctx.fillText(name.toUpperCase(), px + 8, py)
        }
      }

      // hub
      {
        const [x, y, zc] = view(hubVec)
        if (zc > 0) {
          const px = sx(x), py = sy(y)
          const g = ctx.createRadialGradient(px, py, 0, px, py, 16)
          g.addColorStop(0, 'rgba(196, 228, 252, 0.9)')
          g.addColorStop(0.3, 'rgba(120, 180, 240, 0.35)')
          g.addColorStop(1, 'rgba(120, 180, 240, 0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(px, py, 16, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#eaf4fd'
          ctx.beginPath()
          ctx.arc(px, py, 2.8, 0, Math.PI * 2)
          ctx.fill()
          if (!small) {
            ctx.font = '600 11px "DM Mono", monospace'
            ctx.fillStyle = 'rgba(234, 244, 253, 0.95)'
            ctx.fillText(hub[2].toUpperCase(), px + 9, py - 8)
          }
        }
      }
    }

    const loop = () => {
      if (!running) return
      t += 0.016
      if (!dragging) rot += 0.0011 + spin
      spin *= 0.94
      drawFrame()
      frame = requestAnimationFrame(loop)
    }

    const onDown = (e) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture?.(e.pointerId) }
    const onMove = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      rot -= dx * 0.005
      spin = -dx * 0.0004
      if (prefersReducedMotion()) drawFrame()
    }
    const onUp = () => { dragging = false }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    resize()
    if (prefersReducedMotion()) {
      t = 2
      drawFrame()
      return () => {
        canvas.removeEventListener('pointerdown', onDown)
        canvas.removeEventListener('pointermove', onMove)
        canvas.removeEventListener('pointerup', onUp)
        canvas.removeEventListener('pointercancel', onUp)
      }
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting)
      if (visible && !running) {
        running = true
        frame = requestAnimationFrame(loop)
      } else if (!visible) {
        running = false
        cancelAnimationFrame(frame)
      }
    })
    observer.observe(canvas)
    frame = requestAnimationFrame(loop)

    const onResize = () => resize()
    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(frame)
      } else if (!running) {
        running = true
        frame = requestAnimationFrame(loop)
      }
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [hub, markets])

  return <canvas ref={ref} className={`globe-canvas ${className}`} aria-hidden="true" />
}

/* ------------------------------------------------------------------ */
/* Parallax: children drift at a fraction of scroll speed              */


/* ------------------------------------------------------------------ */
/* PinnedShowcase: sticky viewport, panels slide horizontally on scroll */


/* ------------------------------------------------------------------ */
/* Preloader: counts up once per session, then lifts away              */


/* ------------------------------------------------------------------ */
/* Magnetic buttons                                                    */
/* ------------------------------------------------------------------ */

export function Magnetic({ as: Tag = 'button', className = '', strength = 0.3, children, ...rest }) {
  const ref = useRef(null)

  const onMove = (event) => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const r = el.getBoundingClientRect()
    const x = (event.clientX - (r.left + r.width / 2)) * strength
    const y = (event.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
  }

  const onLeave = () => { if (ref.current) ref.current.style.transform = '' }

  return (
    <Tag ref={ref} className={`magnetic ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Marquee                                                             */


/* ------------------------------------------------------------------ */
/* Custom cursor                                                       */


/* ------------------------------------------------------------------ */
/* Scroll progress                                                     */
/* ------------------------------------------------------------------ */

export function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return <div className="scroll-progress" aria-hidden="true"><span ref={barRef} /></div>
}
