vertex
======

A management tool for nodejs webapp hosting.

# Project Goals #
`vertex` is a management tool for Ubuntu server that easily enables you to host nodejs applications. It is controlled with a RESTful HTTP interface. Features include:

- automated install and removal of node applications
- isolated networking environment for node applications (using Linux namespaces)

# Getting Started #
**Warning:** `vertex` is in alpha state right now. Using it might introduce severe security leaks on your server. Feature relases will have breaking changes. It may crash any time for unknown reason.  

To set up `vertex` on your Ubuntu server, follow the folling steps.

## Create Debian Package ##
Use any Debian-based machine with installed node to create the vertex package:

- Clone this repository and install dependencies with `npm install`.
- Set up your system for creating Debian packages: `sudo apt-get install debhelper devscripts build-essential dh-make`
- Use grunt to create a Debian package: `grunt debian_package` (Make sure `vertex` is currently not installed on the system you create the package on!)

## Install `vertex` ##
Install `vertex` on your server:

- Make sure all `vertex` dependencies are installed on your server: `sudo apt-get install nginx`
- Transfer the `.deb`-file to your server and install it using `sudo dpkg -i vertex*.deb`.
- To finish setup, reload `nginx` configuration and start `vertex`: `sudo service vertex start`
- Make sure routing is enabled and your Internet-connected interface (`eth0`) is set up to do NAT:
```
sudo sysctl -w net.ipv4.ip_forward=1
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

## Use `vertex` ##
To tell `vertex` to install your first nodejs app, send the following `POST` request to http://vertex/app:
```
{
  "hostname": "sample.vertex",
  "git": "https://github.com/nils-wisiol/vertex-sample.git"
}
```

`vertex` will return the details of the app installed. To see the result, go to http://sample.vertex/
