/////////// FS dependencies //////////////
const fs = require('fs');
const { COPYFILE_EXCL } = fs.constants; // Used to prevent overriding the destination file
const { fileURLToPath } = require('url');
const path = require('path');
const util = require('util');
const { execFile } = require('child_process');

/////////// socket and express ////////////
const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const { dirname } = require('path');
const PORT = 2000 || process.env.PORT;
const app = express();
var server = app.listen(PORT, () => console.log(`server started at ${PORT}`));

const io = socketIo.listen(server);

/////////////////////////////////// Fucntions /////////////////////////////
function copy (filePath, directoryName) {
    argsArray = [filePath, directoryName]; // Both the path of file to be copied, and destination folder
    console.log('args', argsArray);
    fileName = argsArray[0].split(path.sep).slice(-1).pop();

    // By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
    try {
        fs.copyFileSync(argsArray[0], path.join(argsArray[1], fileName), COPYFILE_EXCL);
        return "copied successfully"
    } catch (err) {
        if (err) {
            // Could not copy because destination already exists
            if (err.code == 'EEXIST'){
                // let response = readlineSync.question('The file already exists, do you want to override it?');
                // if (response == 'yes'){
                //     // destination.txt will be created or overwritten by default.
                //     fs.copyFile(argsArray[0], path.join(argsArray[1], fileName), err => {
                //         if (err) throw err;

                //         console.log(`${argsArray[0]} was copied to ${path.join(argsArray[1], fileName)}`);
                //     });
                // }
                return "the item already exists in the destination directory";
            } else {
                // Any other error
                return err;
            }
        }
    }
}

function cut (filePath, directoryName) {
    argsArray = [filePath, directoryName]; // Both the path of file to be copied, and destination folder
    fileName = argsArray[0].split(path.sep).slice(-1).pop();

    // Check if the destination file exists
    try {
        if(fs.existsSync(path.join(argsArray[1], fileName))) {
            return "There is a file with the same name in the destination directory";
            // The file exists don't perform the cut
        } else {
            // The file doesn't exist already, perfome the cut
            try{
                fs.renameSync(argsArray[0], path.join(argsArray[1], fileName));
                return 'Moved successfully';
            }
            catch (err) {
                if (err) 
                    return err;
            }
        }
    } catch (err) {
        return err;
    }
}

function remove (filePath) {
    filePath = filePath

    try {
        fs.unlinkSync(filePath); 
        return 'successfully deleted';
    } catch (err) {
        if (err) {
            return err;
        }
    }
}

function rename (filePath, newName) {
    argsArray = [filePath, newName]; // Both the path of file to be copied, and destination folder
    var folderPath = argsArray[0].substr(0, argsArray[0].lastIndexOf(path.sep));

    // Check if the destination file exists
    try {
        if(fs.existsSync(path.join(argsArray[1], argsArray[1]))) {
            return "There is a file with the same name in the destination directory";
            // The file exists don't perform the cut
        } else {
            // The file doesn't exist already, perfome the cut
            try{
                fs.renameSync(argsArray[0], path.join(folderPath, argsArray[1]));
                return 'Renamed successfully';
            }
            catch (err) {
                if (err) 
                    return err;
            }
        }
    } catch (err) {
        return err;
    }
}

io.on("connection", (socket) => {
  console.log("New client connected");
    socket.on('copy', (data) => {
        console.log('performing copy on', data);
        socket.emit('notification', copy(data.text1, data.text2));
    })
    socket.on('cut', (data) => {
        console.log(data);
        socket.emit('notification', cut(data.text1, data.text2));
    })
    socket.on('rename', (data) => {
        console.log(data);
        socket.emit('notification', rename(data.text1, data.text2));
    })
    socket.on('delete', (data) => {
        console.log(data);
        socket.emit('notification', remove(data.text1, data.text2));
    })
});

io.on("disconnect", () => {
console.log("Client disconnected");
});

var count = 1;
setInterval(() => {
    // io.emit('dataChange', count++);
    // console.log('emiting new data', count);
}, 200);