# matrix

A toy project to drive the sense-hat's matrx using Go(http, gorilla, and Periph) and P5.js

## A note from the embd repo.

### Build the binary for linux/ARM:

```
$ export GOOS=linux
$ export GOARCH=arm
$ go build simpleblinker.go
```

### Copy the cross-compiled binary to your RaspberryPi*:

```
$ scp simpleblinker pi@192.168.2.2:~
```

### Then on the rPi run the program with sudo*:

```
$ sudo ./simpleblinker
```

### How to generate ssh key and save it to rpi?

```
// will be asked about the file name (test in this case)
$ ssh-keygen -t rsa -b 2048 -v
// copying the pub key to the host
$ ssh-copy-id -i .ssh/test pi@192.168.0.6 -p 2222
// testing
$ ssh -p 2222 pi@192.168.0.6
```
