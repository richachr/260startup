# CS 260 Notes

[My startup](https://github.com/richachr/260startup)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## Specification Notes

I learned lots about useful commands in git that I had never used before, such as `git commit -am` and what pull requests are. I also learned about the importance of a good commit history and consistent work. I learned about mermaid and sequence diagrams. I also learned how to write things in VIM, like this sentence!

## AWS Notes

Do more research on Caddy. I learned that architecture diagrams can be made in Google Docs. I learned about DNS records: A (Address), CNAME (Alias), NS (Name Servers, verification). Layers: Application--HTTPS, Transport--TCP,Internet--IP, Link--Fiber, hardware. 

Public IP: 100.29.141.252 ; ssh: ssh -i ~/Documents/CS/CS260/encrypted/260keypair.pem ubuntu@rappt.click; You can restart Caddy with sudo service caddy restart ; 

URL: rappt.click

## HTML Notes

Special characters: & &amp;, < &lt;, > &gt;, " &quot;, ' &apos;, 😀 &#128512;

Div is a block, span is inline. Heading goes from 1-9. a tags can be called 'anchor'.

Deploy: ./deployService.sh -k ~/CS260/encrypted/260keypair.pem -h rappt.click -s simon

## JS Notes

Study closure, useEffect, useState. Important functions: JSON.stringify(), JSON.parse(), localstorage.setItem(), localstorage.getItem(), localstorage.removeItem(), localstorage.clear(), Object.entries, Object.keys, Object.values().

New objects: new Name(); this.var instead of self.var, inheritance: class 1 extends 2, super(props) for parent constructor. array.forEach(). for(const name in array) iterates over indices, for(const name of array) iterates through values.

## Service Notes

Services have endpoints. IAnA MIME types: text/html, application/json, image/jpg, video/mp4, used as accept or content-type. CURL -X POST url -d {body}