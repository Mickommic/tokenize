/* https://github.com/Mickommic/tokenize/ */
popobj = null

function quote(a){
	return (a + '').replace(/[\\"]/g, '\\$&').replace(/\r?\n|\r/g, '\\n').replace(/\t/g, '\\t')//.replace(/\u0000/g, '\\0')
}

function long2ip(a){
	return (a >>> 24) + '.' + (a >>> 16 & 255) + '.' + (a >>> 8 & 255) + '.' + (a & 255)
}

function now(){
	return (new Date()).toJSON().slice(0, -1).replace(/T/, ' ')
}

function clip(a, b, c){
	return Math.max(Math.min(a, b || 1), c || 0)
}

function revi(a, b){
	return !b || Array.isArray(b) || b.length > 11 || isNaN(a = parseInt(b)) ? b : a
}

function el(a, b, c, d){
	d = document.createElement(d || 'div')

	if(a) d.innerHTML = a
	if(b) b.appendChild(d)
	if(c) d.className = c

	return d
}

function tokenize(a, b, c, d, e){
	let f = a

	if(!b) b = {}

	loop:{
		for(const g of a.attributes){
			let h = g.name, i

			switch(h[0]){
				case '*':
					if(!c) a.removeAttribute(h)

					if((i = h.indexOf('-')) > 1){
						const j = h.slice(i + 1)

						if(f = window[j])
							f = new f(a, g.value, b, e)
						else
							console.error('Объект "' + j + '" (из атрибута "' + h + '") отсутствует в глобальном контексте!')

						h = h.slice(0, i)
					}

					if(f && f != a) f._ = a
					else f = {_: a}
				case '^':
					if(!c) a.removeAttribute(g.name)

					let k = h.slice(1)

					if(k.slice(-2) == '[]'){
						k = k.slice(0, -2)

						if(!b[k] || !Array.isArray(b[k])) b[k] = []

						b[k].push(f)
					}else
						b[k] = f

					if(f != a) e = k

					break loop
			}
		}
	}

	if(d >= 0) d--

	if(!(d < 0)){
		if(f == a) f = b

		for(const g of a.children) tokenize(g, f, c, d, e)
	}

	return b
}

function cooku(a, b, c){
	if(!c){
		const d = new Date()
		d.setTime(d.getTime() + 315360000000)
		c = d.toGMTString()
	}

	document.cookie = a + ' = ' + b + '; expires = ' + c + '; path=' + location.pathname
}

function getRule(a){
	for(const s of document.styleSheets)
		for(const r of s.cssRules)
			if(r.selectorText == a) return r
}

function readFile(a, b){
	return new Promise(r => {
		const c = new FileReader()

		c.onload = () => r(c.result)

		if(b == 1) c.readAsDataURL(a)
		else
		if(!b) c.readAsText(a)
		else
			c.readAsArrayBuffer(a)
	})
}

function modal(a, b, c, d){
	const t = this
	const m = el('<div ^window style="' + (b || '') + '" class="' + (c || '') + '">' + a + '</div>', document.body, 'flexccc full modal')
	let f = null
	t.shadow = m

	tokenize(m, t)

	t.append = (a, b) => {
		if(b = m.window) b.appendChild(a)
	}

	t.show = a => {
		m.style.display = a ? '' : 'none'
	}

	t.destroy = a => {
		if(a = m.parentNode) a.removeChild(m)
	}

	t.close = a => {
		if(a || !d || !d(t)){
			m.classList.remove('modalshow')

			setTimeout(() => {t.destroy()}, 300)
		}
	}

	m.onmousedown = e => {f = e.target}

	m.onclick = e => {
		if(e.target == m && (!f || f == m)) t.close()
	}

	setTimeout(() => {m.classList.add('modalshow')}, 10)
}

function popmenu(){
	const t = this
	let c = ''

	this.show = (a, e, cb) => {
		const f = t.__
		e.stopPropagation()
		e.preventDefault()

		if(popobj) popobj.hide(e)

		if(t._ && (e.button || a != f)){
			if(cb) cb(t)

			const w = document.body.clientWidth - t._.clientWidth, h = document.body.clientHeight - t._.clientHeight
			let l = 0, u = 0, r, x, y
			c = ''

			if(e.button){
				x = e.clientX
				y = e.clientY
				r = {top: y, right: x}
			}else{
				r = a.getBoundingClientRect()
				x = r.left
				y = r.bottom
			}

			if(y < h){
				u = y
				c = 't'
			}else{
				u = r.top - t._.clientHeight
				c = 'b'
			}

			if(x < w){
				l = x
				c += 'l'
			}else{
				l = r.right - t._.clientWidth
				c += 'r'
			}

			t._.style.top = u + 'px'
			t._.style.left = l + 'px'
			c = 'o pop' + c
			popobj = t
			t.__ = a

			setTimeout(() => {
				t._.className += c
				t._.setAttribute('tabindex', 0)
				t._.focus()
				t._.removeAttribute('tabindex')
			}, 10)
		}
	}

	this.hide = e => {
		if(e.target.hasAttribute('popstay')) e.stopPropagation()
		else
		if(t._){
			t._.className = t._.className.slice(0, -c.length)
			popobj = null
			t.__ = null
		}
	}
}
