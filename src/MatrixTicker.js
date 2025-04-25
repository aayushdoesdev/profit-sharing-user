
import config from '../matrixcnfg.js';

var MatrixTicker = function (params) {
	const currentRootUrl = window.location.origin;
	var modifiedOrigin = currentRootUrl.replace(/^https?:\/\//, ''); 
	if(modifiedOrigin === 'admin.matrixtradingtech.com'){
		modifiedOrigin ="app.matrixtradingtech.com"
	}else if(modifiedOrigin === 'admin.punchmyorders.in'){
		modifiedOrigin ="app.punchmyorders.in"
	}
	var root = params.root || 'wss://' + modifiedOrigin + '/websocket/ws'
	var read_timeout = 2, // seconds
		reconnect_max_delay = 0,
		reconnect_max_tries = 0,

		// message flags (outgoing)
		mSubscribe = 'subscribe',
		mUnSubscribe = 'unsubscribe',
		mSetMode = 'mode',

		// incoming
		mAlert = 10,
		mMessage = 11,
		mLogout = 12,
		mReload = 13,
		mClearCache = 14,
		modeFull = 'full', // Full quote including market depth. 164 bytes.
		modeQuote = 'quote', // Quote excluding market depth. 52 bytes.
		modeLTP = 'ltp'

	this.modeFull = modeFull


	this.modeQuote = modeQuote

	
	this.modeLTP = modeLTP

	var ws = null,
		triggers = {'connect': [],
			'ticks': [],
			'disconnect': [],
			'error': [],
			'close': [],
			'reconnect': [],
			'noreconnect': [],
			'message': [],
			'order_update': []},
		read_timer = null,
		last_read = 0,
		reconnect_timer = null,
		auto_reconnect = false,
		current_reconnection_count = 0,
		last_reconnect_interval = 0,
		current_ws_url = null,
		token_modes = {},
		defaultReconnectMaxDelay = 60,
		defaultReconnectMaxRetries = 50,
		maximumReconnectMaxRetries = 300,
		minimumReconnectMaxDelay = 5

	// segment constants
	var NseCM = 1,
		NseFO = 2,
		NseCD = 3,
		BseCM = 4,
		BseFO = 5,
		BseCD = 6,
		McxFO = 7,
		McxSX = 8,
		Indices = 9

	// Enable auto reconnect by default
	if (!params.reconnect) params.reconnect = true
	autoReconnect(params.reconnect, params.max_retry, params.max_delay)

	this.autoReconnect = function (t, max_retry, max_delay) {
		autoReconnect(t, max_retry, max_delay)
	}

	this.connect = function () {
		// Skip if its already connected
		if (ws && (ws.readyState == ws.CONNECTING || ws.readyState == ws.OPEN)) return
		let url
		if(config.env=="production"){
			url = root + '?token=' + params.token 

		}else{

			url = "ws://localhost:8086/websocket/ws" + '?token=' + params.token 
		}
		ws = new WebSocket(url)

		ws.binaryType = 'arraybuffer'

		ws.onopen = function () {
			// Reset last reconnect interval
			last_reconnect_interval = null
			// Reset current_reconnection_count attempt
			current_reconnection_count = 0
			// Store current open connection url to check for auto re-connection.
			if (!current_ws_url) current_ws_url = this.url
			// Trigger on connect event
			trigger('connect')
			// If there isn't an incoming message in n seconds, assume disconnection.
			clearInterval(read_timer)

			last_read = new Date()
			read_timer = setInterval(function () {
				try{
					ws.send("ping")
					last_read = new Date()
				}catch(e){
				}
				if ((new Date() - last_read) / 1000 >= read_timeout) {
					current_ws_url = null
					if (ws) ws.close()
					clearInterval(read_timer)
					triggerDisconnect()
				}
			}, read_timeout * 1000)
		}
	
		ws.onmessage = function (e) {
				trigger('ticks', [e.data])
		
			last_read = new Date()
		}

		ws.onerror = function (e) {
			trigger('error', [e])

			// Force close to avoid ghost connections
			if (this && this.readyState == this.OPEN) this.close()
		}

		ws.onclose = function (e) {
			trigger('close', [e])

			if (current_ws_url && (this.url != current_ws_url)) return

			triggerDisconnect(e)
		}
	}


	this.disconnect = function () {
		if (ws && ws.readyState != ws.CLOSING && ws.readyState != ws.CLOSED) {
			ws.close()
		}
	}

	this.connected = function () {
		if (ws && ws.readyState == ws.OPEN) {
			return true
		} else {
			return false
		}
	}

	this.on = function (e, callback) {
		if (triggers.hasOwnProperty(e)) {
			triggers[e].push(callback)
		}
	}

	this.subscribe = function (tokens) {
		let tokensd=[...new Set(tokens)]
		tokensd = tokensd.slice(0, 90);
		if (tokensd.length > 0) {
			send({
				"type":"subscribe",
				"channels":tokensd
			})
		}
		
		return tokensd
	}

	this.unsubscribe = function (tokens) {
		// if (tokens.length > 0) {
		// 	send({'a': mUnSubscribe, 'v': tokens})
		// }
		return tokens
	}

	this.setMode = function (mode, tokens) {
		// if (tokens.length > 0) {
		// 	send({'a': mSetMode, 'v': [mode, tokens]})
		// }
		return tokens
	}

	function autoReconnect (t, max_retry, max_delay) {
		auto_reconnect = (t == true)

		// Set default values
		max_retry = max_retry || defaultReconnectMaxRetries
		max_delay = max_delay || defaultReconnectMaxDelay

		// Set reconnect constraints
		reconnect_max_tries = max_retry >= maximumReconnectMaxRetries ? maximumReconnectMaxRetries : max_retry
		reconnect_max_delay = max_delay <= minimumReconnectMaxDelay ? minimumReconnectMaxDelay : max_delay
	}

	function triggerDisconnect (e) {
		ws = null
		trigger('disconnect', [e])
		if (auto_reconnect) attemptReconnection()
	}
	
     this.close =function (){
        if (ws && ws.readyState != ws.CLOSING && ws.readyState != ws.CLOSED) {
			ws.close()
			auto_reconnect=false
			
		}
    }

	this.subscribe_notification = function (message) {
		try {
			if (typeof (message) === 'object') {
				message = JSON.stringify(message)
			}
			ws.send(message)
		} catch (e) { 
			ws.close() };
	}

	// send a message via the socket
	// automatically encodes json if possible
	function send (message) {
		if (!ws || ws.readyState != ws.OPEN) return

		try {
			if (typeof (message) === 'object') {
				message = JSON.stringify(message)
			}
			ws.send(message)
		} catch (e) { 
			ws.close() };
	}

	// trigger event callbacks
	function trigger (e, args) {
		if (!triggers[e]) return
		for (var n = 0; n < triggers[e].length; n++) {
			triggers[e][n].apply(triggers[e][n], args || [])
		}
	}


	// split one long binary message into individual tick packets

	function attemptReconnection () {
		// Try reconnecting only so many times.
		if (current_reconnection_count > reconnect_max_tries) {
			trigger('noreconnect')
			process.exit(1)
		}

		if (current_reconnection_count > 0) {
			last_reconnect_interval = Math.pow(2, current_reconnection_count)
		} else if (!last_reconnect_interval) {
			last_reconnect_interval = 1
		}

		if (last_reconnect_interval > reconnect_max_delay) {
			last_reconnect_interval = reconnect_max_delay
		}

		current_reconnection_count++

		trigger('reconnect', [current_reconnection_count, last_reconnect_interval])

		reconnect_timer = setTimeout(function () {
			self.connect()
		}, last_reconnect_interval * 1000)
	}



	var self = this
}


export default MatrixTicker;