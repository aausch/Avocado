transporter.module.create('programming_environment/categorize_libraries', function(requires) {}, function(thisModule) {


thisModule.addSlots(lobby, function(add) {

  add.method('categorizeGlobals', function () {
      // These lists come from a simple little HTML page that we wrote to get a list of the stuff
      // that comes built-in to the window object. Ideally we'd like to categorize *everything*.
      // For now, this at least gets a few hundred attributes out of our hair. -- Adam, August 2010

      var globalObjectCategories = [
      [['built-ins', 'SVG'], ['SVGAElement', 'SVGAltGlyphElement', 'SVGAngle', 'SVGAnimateColorElement', 'SVGAnimateElement', 'SVGAnimateTransformElement', 'SVGAnimatedAngle', 'SVGAnimatedBoolean', 'SVGAnimatedEnumeration', 'SVGAnimatedInteger', 'SVGAnimatedLength', 'SVGAnimatedLengthList', 'SVGAnimatedNumber', 'SVGAnimatedNumberList', 'SVGAnimatedPreserveAspectRatio', 'SVGAnimatedRect', 'SVGAnimatedString', 'SVGAnimatedTransformList', 'SVGCircleElement', 'SVGClipPathElement', 'SVGColor', 'SVGCursorElement', 'SVGDefsElement', 'SVGDescElement', 'SVGDocument', 'SVGElement', 'SVGElementInstance', 'SVGElementInstanceList', 'SVGEllipseElement', 'SVGException', 'SVGFontElement', 'SVGFontFaceElement', 'SVGFontFaceFormatElement', 'SVGFontFaceNameElement', 'SVGFontFaceSrcElement', 'SVGFontFaceUriElement', 'SVGForeignObjectElement', 'SVGGElement', 'SVGGlyphElement', 'SVGGradientElement', 'SVGImageElement', 'SVGLength', 'SVGLengthList', 'SVGLineElement', 'SVGLinearGradientElement', 'SVGMarkerElement', 'SVGMaskElement', 'SVGMatrix', 'SVGMetadataElement', 'SVGMissingGlyphElement', 'SVGNumber', 'SVGNumberList', 'SVGPaint', 'SVGPathElement', 'SVGPathSeg', 'SVGPathSegArcAbs', 'SVGPathSegArcRel', 'SVGPathSegClosePath', 'SVGPathSegCurvetoCubicAbs', 'SVGPathSegCurvetoCubicRel', 'SVGPathSegCurvetoCubicSmoothAbs', 'SVGPathSegCurvetoCubicSmoothRel', 'SVGPathSegCurvetoQuadraticAbs', 'SVGPathSegCurvetoQuadraticRel', 'SVGPathSegCurvetoQuadraticSmoothAbs', 'SVGPathSegCurvetoQuadraticSmoothRel', 'SVGPathSegLinetoAbs', 'SVGPathSegLinetoHorizontalAbs', 'SVGPathSegLinetoHorizontalRel', 'SVGPathSegLinetoRel', 'SVGPathSegLinetoVerticalAbs', 'SVGPathSegLinetoVerticalRel', 'SVGPathSegList', 'SVGPathSegMovetoAbs', 'SVGPathSegMovetoRel', 'SVGPatternElement', 'SVGPoint', 'SVGPointList', 'SVGPolygonElement', 'SVGPolylineElement', 'SVGPreserveAspectRatio', 'SVGRadialGradientElement', 'SVGRect', 'SVGRectElement', 'SVGRenderingIntent', 'SVGSVGElement', 'SVGScriptElement', 'SVGSetElement', 'SVGStopElement', 'SVGStringList', 'SVGStyleElement', 'SVGSwitchElement', 'SVGSymbolElement', 'SVGTRefElement', 'SVGTSpanElement', 'SVGTextContentElement', 'SVGTextElement', 'SVGTextPathElement', 'SVGTextPositioningElement', 'SVGTitleElement', 'SVGTransform', 'SVGTransformList', 'SVGUnitTypes', 'SVGUseElement', 'SVGViewElement', 'SVGZoomEvent']],
      [['built-ins', 'SVG', 'Chrome'], ['SVGComponentTransferFunctionElement', 'SVGFEBlendElement', 'SVGFEColorMatrixElement', 'SVGFEComponentTransferElement', 'SVGFECompositeElement', 'SVGFEConvolveMatrixElement', 'SVGFEDiffuseLightingElement', 'SVGFEDisplacementMapElement', 'SVGFEDistantLightElement', 'SVGFEFloodElement', 'SVGFEFuncAElement', 'SVGFEFuncBElement', 'SVGFEFuncGElement', 'SVGFEFuncRElement', 'SVGFEGaussianBlurElement', 'SVGFEImageElement', 'SVGFEMergeElement', 'SVGFEMergeNodeElement', 'SVGFEMorphologyElement', 'SVGFEOffsetElement', 'SVGFEPointLightElement', 'SVGFESpecularLightingElement', 'SVGFESpotLightElement', 'SVGFETileElement', 'SVGFETurbulenceElement', 'SVGFilterElement', 'SVGHKernElement', 'SVGVKernElement']],
      [['built-ins', 'DOM'], ['HTMLAllCollection', 'HTMLAnchorElement', 'HTMLAppletElement', 'HTMLAreaElement', 'HTMLAudioElement', 'HTMLBRElement', 'HTMLBaseElement', 'HTMLBaseFontElement', 'HTMLBlockquoteElement', 'HTMLBodyElement', 'HTMLButtonElement', 'HTMLCanvasElement', 'HTMLCollection', 'HTMLDListElement', 'HTMLDirectoryElement', 'HTMLDivElement', 'HTMLDocument', 'HTMLElement', 'HTMLEmbedElement', 'HTMLFieldSetElement', 'HTMLFontElement', 'HTMLFormElement', 'HTMLFrameElement', 'HTMLFrameSetElement', 'HTMLHRElement', 'HTMLHeadElement', 'HTMLHeadingElement', 'HTMLHtmlElement', 'HTMLIFrameElement', 'HTMLImageElement', 'HTMLInputElement', 'HTMLIsIndexElement', 'HTMLLIElement', 'HTMLLabelElement', 'HTMLLegendElement', 'HTMLLinkElement', 'HTMLMapElement', 'HTMLMarqueeElement', 'HTMLMediaElement', 'HTMLMenuElement', 'HTMLMetaElement', 'HTMLModElement', 'HTMLOListElement', 'HTMLObjectElement', 'HTMLOptGroupElement', 'HTMLOptionElement', 'HTMLParagraphElement', 'HTMLParamElement', 'HTMLPreElement', 'HTMLQuoteElement', 'HTMLScriptElement', 'HTMLSelectElement', 'HTMLStyleElement', 'HTMLTableCaptionElement', 'HTMLTableCellElement', 'HTMLTableColElement', 'HTMLTableElement', 'HTMLTableRowElement', 'HTMLTableSectionElement', 'HTMLTextAreaElement', 'HTMLTitleElement', 'HTMLUListElement', 'HTMLVideoElement']],
      [['built-ins', 'CSS'], ['CSSCharsetRule', 'CSSFontFaceRule', 'CSSImportRule', 'CSSMediaRule', 'CSSPageRule', 'CSSPrimitiveValue', 'CSSRule', 'CSSRuleList', 'CSSStyleDeclaration', 'CSSStyleRule', 'CSSStyleSheet', 'CSSValue', 'CSSValueList', 'CSSVariablesDeclaration', 'CSSVariablesRule']],
      [['built-ins', 'event handlers'], ['onabort', 'onbeforeunload', 'onblur', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'oncontextmenu', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmessage', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpause', 'onplay', 'onplaying', 'onpopstate', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onsearch', 'onseeked', 'onseeking', 'onselect', 'onstalled', 'onstorage', 'onsubmit', 'onsuspend', 'ontimeupdate', 'onunload', 'onvolumechange', 'onwaiting', 'onwebkitanimationend', 'onwebkitanimationiteration', 'onwebkitanimationstart', 'onwebkittransitionend']],
      [['built-ins', 'uncategorized'], ['Attr', 'Audio', 'BeforeLoadEvent', 'Blob', 'CDATASection', 'CanvasRenderingContext2D', 'CharacterData', 'ClientRect', 'ClientRectList', 'Clipboard', 'Comment', 'Counter', 'DOMException', 'DOMImplementation', 'DOMParser', 'Document', 'DocumentFragment', 'DocumentType', 'Element', 'Entity', 'EntityReference', 'EvalError', 'Event', 'EventException', 'EventSource', 'File', 'FileList', 'FormData', 'Image', 'ImageData', 'KeyboardEvent', 'MediaError', 'MediaList', 'MessageChannel', 'MessageEvent', 'MessagePort', 'MimeType', 'MimeTypeArray', 'MouseEvent', 'MutationEvent', 'NamedNodeMap', 'Node', 'NodeFilter', 'NodeList', 'Notation', 'Option', 'OverflowEvent', 'PageTransitionEvent', 'Plugin', 'PluginArray', 'ProcessingInstruction', 'ProgressEvent', 'RGBColor', 'Range', 'RangeError', 'RangeException', 'Rect', 'ReferenceError', 'SharedWorker', 'Storage', 'StorageEvent', 'StyleSheet', 'StyleSheetList', 'SyntaxError', 'Text', 'TextEvent', 'TextMetrics', 'TypeError', 'UIEvent', 'URIError', 'WebKitAnimationEvent', 'WebKitCSSKeyframeRule', 'WebKitCSSKeyframesRule', 'WebKitCSSMatrix', 'WebKitCSSTransformValue', 'WebKitPoint', 'WebKitTransitionEvent', 'WebSocket', 'WheelEvent', 'Worker', 'XMLDocument', 'XMLHttpRequest', 'XMLHttpRequestException', 'XMLHttpRequestUpload', 'XMLSerializer', 'XPathEvaluator', 'XPathException', 'XPathResult', 'XSLTProcessor', 'addEventListener', 'alert', 'applicationCache', 'atob', 'blur', 'btoa', 'captureEvents', 'clearInterval', 'clearTimeout', 'clientInformation', 'close', 'closed', 'confirm', 'console', 'crypto', 'defaultStatus', 'defaultstatus', 'devicePixelRatio', 'dispatchEvent', 'document', 'event', 'find', 'focus', 'frameElement', 'frames', 'getComputedStyle', 'getMatchedCSSRules', 'getSelection', 'history', 'innerHeight', 'innerWidth', 'length', 'localStorage', 'location', 'locationbar', 'menubar', 'moveBy', 'moveTo', 'name', 'navigator', 'offscreenBuffering', 'open', 'openDatabase', 'opener', 'outerHeight', 'outerWidth', 'pageXOffset', 'pageYOffset', 'parent', 'personalbar', 'postMessage', 'print', 'prompt', 'releaseEvents', 'removeEventListener', 'resizeBy', 'resizeTo', 'screen', 'screenLeft', 'screenTop', 'screenX', 'screenY', 'scroll', 'scrollBy', 'scrollTo', 'scrollX', 'scrollY', 'scrollbars', 'self', 'sessionStorage', 'setInterval', 'setTimeout', 'showModalDialog', 'status', 'statusbar', 'stop', 'styleMedia', 'toolbar', 'top', 'webkitConvertPointFromNodeToPage', 'webkitConvertPointFromPageToNode', 'window']],
      [['built-ins', 'uncategorized', 'Firefox'], ['_options', 'back', 'content', 'controllers', 'disableExternalCapture', 'dump', 'enableExternalCapture', 'forward', 'fullScreen', 'getInterface', 'globalStorage', 'home', 'mozAnimationStartTime', 'mozInnerScreenX', 'mozInnerScreenY', 'mozPaintCount', 'mozRequestAnimationFrame', 'moz_indexedDB', 'netscape', 'openDialog', 'pkcs11', 'routeEvent', 'scrollByLines', 'scrollByPages', 'scrollMaxX', 'scrollMaxY', 'setResizable', 'sizeToContent', 'updateCommands']],
      [['built-ins', 'uncategorized', 'Chrome'], ['BlobBuilder', 'CanvasGradient', 'CanvasPattern', 'DOMStringList', 'FileError', 'FileReader', 'HTMLMeterElement', 'HTMLProgressElement', 'SQLException', 'TimeRanges', 'TouchEvent', 'chrome', 'chromium', 'external', 'webkitNotifications', 'webkitPerformance']],
      [['libraries', 'Prototype'], ['$$', '$', '$A', '$F', '$H', '$R', '$break', '$continue', '$w', 'Abstract', 'Ajax', 'Class', 'Enumerable', 'Field', 'Form', 'Hash', 'Insertion', 'ObjectRange', 'PeriodicalExecuter', 'Position', 'Prototype', 'Selector', 'Template', 'Toggle', 'Try']],
      [['libraries', 'MooTools'], ['$family', 'MooTools', 'addEvent', 'addEvents', 'addListener', 'cloneEvents', 'eliminate', 'fireEvent', 'getCoordinates', 'getDocument', 'getHeight', 'getLeft', 'getPosition', 'getScroll', 'getScrollHeight', 'getScrollLeft', 'getScrollSize', 'getScrollTop', 'getScrollWidth', 'getSize', 'getTop', 'getWidth', 'getWindow', 'removeEvent', 'removeEvents', 'removeListener', 'retrieve', 'store', 'uid']],
      [['JSQuiche', 'libraries', 'Moousture'], ['Moousture']],
      [['JSQuiche', 'libraries', 'JSLint'], ['JSLINT']],
      [['JSQuiche', 'lively kernel'], ['$morph', 'ClipboardHack', 'Config', 'ContextJS', 'Converter', 'CustomJSON', 'DisplayThemes', 'Functions', 'Global', 'GlobalLayers', 'LayerStack', 'LayerableObjectTrait', 'LivelyNS', 'Loader', 'ModelMigration', 'NetRequestReporterTrait', 'NodeFactory', 'NodeStyle', 'Properties', 'Strings', 'UserAgent', 'ViewTrait', 'XHTMLNS', 'XLinkNS', 'basicResize', 'classes', 'composeLayers', 'computerLayersFor', 'connect', 'cop', 'createLayer', 'currentLayers', 'dbgOn', 'disableLayer', 'disconnect', 'disconnectAll', 'enableLayer', 'ensurePartialLayer', 'equals', 'functions', 'gather', 'getCurrentContext', 'getLayerDefinitionForObject', 'getStack', 'halt', 'initialize', 'inspect', 'interactiveEval', 'layerClass', 'layerClassAndSubclasses', 'layerGetterMethod', 'layerMethod', 'layerObject', 'layerProperty', 'layerPropertyWithShadow', 'layerSetterMethod', 'lively', 'logError', 'logStack', 'makePropertyLayerAware', 'module', 'namespace', 'namespaceIdentifier', 'newDragnDropListPane', 'newListPane', 'newPrintPane', 'newRealListPane', 'newTextListPane', 'newTextPane', 'newXenoPane', 'openStackViewer', 'printError', 'printStack', 'pt', 'rect', 'require', 'resetLayerStack', 'signal', 'subNamespaces', 'updateAttributeConnection', 'using', 'withLayers', 'withoutLayers', 'constructor']],
      [['JSQuiche', 'avocado', 'bootstrap'], ['__annotation__', 'annotator', 'bootstrapTheModuleSystem', 'hackToMakeSuperWork', 'livelyBaseURL', 'lobby', 'modules', 'prototypeAttributeIsEnumerable', 'transporter', 'waitForAllCallbacks', 'currentUser', 'doneLoadingWindow', 'isDoneLoading', 'jsQuicheBaseURL', 'kernelModuleSavingScriptURL', 'logoutURL', 'startAvocadoGoogleApp', 'urlForKernelModuleName', 'wasServedFromGoogleAppEngine', 'worldHasBeenCreated', 'isInCodeOrganizingMode']],
      [['JSQuiche', 'avocado', 'miscellaneous'], ['LayoutModes', 'anonymous_module_0', 'avocado', 'category', 'exitValueOf', 'javascriptReservedWords', 'littleProfiler', 'mirror', 'slots', 'testingObjectGraphWalker', 'categorizeGlobals']]

      ];

      globalObjectCategories.forEach(function(catAndAttrs) {
        annotator.annotationOf(window).categorize(catAndAttrs[0], catAndAttrs[1]);
      });

      }, {category: ['JSQuiche', 'avocado', 'miscellaneous']});

});


});
