# 3D Background (injectable)

Files added:

- `bg/3d-bg.css` — styles for the canvas and overlay
- `bg/3d-bg.js` — script that appends a full-screen canvas and runs the animation

How to enable the effect without editing your existing files:

1) Open your `index.html` in a browser (file:// or served). Open DevTools → Console and paste the following snippet, then press Enter:

```javascript
(function(){
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'bg/3d-bg.css';
  document.head.appendChild(l);
  const s = document.createElement('script');
  s.src = 'bg/3d-bg.js';
  document.body.appendChild(s);
})();
```

2) Optional: create a bookmarklet for quick toggling. Create a new bookmark with this as URL (single line):

```
javascript:(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='bg/3d-bg.css';document.head.appendChild(l);var s=document.createElement('script');s.src='bg/3d-bg.js';document.body.appendChild(s);})()
```

3) To permanently include the background, add to `index.html`:

In `<head>` add:

```html
<link rel="stylesheet" href="bg/3d-bg.css">
```

Before `</body>` add:

```html
<script src="bg/3d-bg.js" defer></script>
```

Notes:
- The effect uses `prefers-reduced-motion`. If a visitor has that enabled, the background will not display.
- The canvas is `pointer-events: none` and placed behind content (`z-index: -1`) so it won't interfere with page interaction.
- If you want different colors, open `bg/3d-bg.js` and adjust the `hue` range or gradient stops.
