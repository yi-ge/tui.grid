(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{140:function(e,t,a){"use strict";a.r(t);a(27);var n=a(8),r=a.n(n),c=a(0),o=a.n(c),s=a(4),i=a.n(s),p=a(146),l=a(148),m=a(149),u=function(e){function t(){return e.apply(this,arguments)||this}return r()(t,e),t.prototype.render=function(){return o.a.createElement("iframe",{className:"tab-content iframe",frameBorder:"0",width:"100%",height:"800",src:this.props.src})},t}(o.a.Component);u.propTypes={src:i.a.string};var h=u,d=function(e){function t(){return e.apply(this,arguments)||this}return r()(t,e),t.prototype.render=function(){return o.a.createElement("pre",{className:"codeblock tui-language-javascript"},o.a.createElement("code",{dangerouslySetInnerHTML:{__html:this.props.code}}))},t}(o.a.Component);d.propTypes={code:i.a.string};var f=d;a(145);a.d(t,"query",function(){return y});var E=function(e){function t(){return e.apply(this,arguments)||this}return r()(t,e),t.prototype.render=function(){var e=this.props.location,t=e.pathname,a=e.hash,n=this.props.data,r=n.examplePageJson,c=n.file,s=r.title,i=r.codeJs,u=r.codeHtml,d=""+t.replace("/","")+a;return o.a.createElement(p.a,{tabIndex:1,selectedNavItemId:d},o.a.createElement("header",null,o.a.createElement("h2",{className:"title"},s)),o.a.createElement("article",null,o.a.createElement(l.a,null,o.a.createElement(m.a,{name:"Result",hasIframe:!0},o.a.createElement(h,{src:c.relativePath})),o.a.createElement(m.a,{name:"JavaScript"},o.a.createElement(f,{code:i})),o.a.createElement(m.a,{name:"HTML"},o.a.createElement(f,{code:u})))))},t}(o.a.Component);E.propTypes={data:i.a.shape({examplePageJson:i.a.object.isRequired,file:i.a.object.isRequired}),location:i.a.shape({pathname:i.a.string,hash:i.a.string})};t.default=E;var y="4788605"}}]);
//# sourceMappingURL=component---src-templates-example-page-js-706c24d95431d77a549c.js.map