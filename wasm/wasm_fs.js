//
// Copyright (c) 2021 Markku Rossi
//
// All rights reserved.
//

const decoder = new TextDecoder("utf-8");
let outputBuf = "";

const enosys = () => {
    const err = new Error("function not implemented");
    err.code = "ENOSYS";
    return err;
};

const einval = () => {
    const err = new Error("invalid argument");
    err.code = "EINVAL";
    return err;
};

global.fs = {
    constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 }, // unused
    writeSync(fd, buf) {
	outputBuf += decoder.decode(buf);
	const nl = outputBuf.lastIndexOf("\n");
	if (nl != -1) {
	    console.log(outputBuf.substr(0, nl));
	    outputBuf = outputBuf.substr(nl + 1);
	}
	return buf.length;
    },
    write(fd, buffer, offset, length, position, callback) {
        if (position != null) {
	    callback(einval());
	    return;
        }
        syscall_write(fd, buffer, offset, length, callback);
    },
    chmod(path, mode, callback) { callback(enosys()); },
    chown(path, uid, gid, callback) { callback(enosys()); },
    close(fd, callback) { callback(enosys()); },
    fchmod(fd, mode, callback) { callback(enosys()); },
    fchown(fd, uid, gid, callback) { callback(enosys()); },
    fstat(fd, callback) {
        syscall_fstat(fd, callback);
    },
    fsync(fd, callback) { callback(null); },
    ftruncate(fd, length, callback) { callback(enosys()); },
    lchown(path, uid, gid, callback) { callback(enosys()); },
    link(path, link, callback) { callback(enosys()); },
    lstat(path, callback) {
        syscall_stat(path, callback);
    },
    mkdir(path, perm, callback) { callback(enosys()); },
    open(path, flags, mode, callback) {
        syscall_open(path, flags, mode, callback);
    },
    read(fd, buffer, offset, length, position, callback) {
        if (offset < 0 || offset + length > buffer.length || position != null) {
            callback(einval());
            return
        }
        syscall_read(fd, buffer, offset, length, callback);
    },
    readdir(path, callback) {
        syscall_readdir(path, callback);
    },
    readlink(path, callback) { callback(enosys()); },
    rename(from, to, callback) { callback(enosys()); },
    rmdir(path, callback) { callback(enosys()); },
    stat(path, callback) {
        syscall_stat(path, callback);
    },
    symlink(path, link, callback) { callback(enosys()); },
    truncate(path, length, callback) { callback(enosys()); },
    unlink(path, callback) { callback(enosys()); },
    utimes(path, atime, mtime, callback) { callback(enosys()); },
};
