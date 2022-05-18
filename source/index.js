const process = require('child_process'),
  splitCharacter = '<##>',
  splitCommit = '|||'


const executeCommand = (command, options, callback) => {
  let dst = __dirname

  if(!!options && options.dst) {
    dst = options.dst
  }

  process.exec(command, {cwd: dst}, function(err, stdout, stderr) {
    if (stdout === '') {
      callback('this does not look like a git repo')
      return
    }

    if (stderr) {
      callback(stderr)
      return
    }

    callback(null, stdout)
  })
}

const prettyFormat = ["%h", "%H", "%s", "%f", "%b", "%at", "%ct", "%an", "%ae", "%cn", "%ce", "%N", "%D"]

const getCommandString = (splitCharacter,nr) =>
  `git log -${nr} --pretty=format:"` + prettyFormat.join(splitCharacter) + splitCommit + '"'

const getLastCommit = (callback, options,number) => {
  const command = getCommandString(splitCharacter,number)

  executeCommand(command, options, function(err, res) {
    if (err) {
      callback(err)
      return
    }
    console.log(res)
    const commits = res.split(splitCommit).filter((commit) => commit !== '')
    let output = []
    commits.forEach((commit) => {
    var a = commit.split(splitCharacter)
    output.push({
      shortHash: a[0],
      hash: a[1],
      subject: a[2],
      sanitizedSubject: a[3],
      body: a[4],
      authoredOn: a[5],
      committedOn: a[6],
      author: {
        name: a[7],
        email: a[8],
      },
      committer: {
        name: a[9],
        email: a[10]
      },
      notes: a[11],
      refs: a[12].split(', ')
      })
    })

    callback(null, output)
  })
}

module.exports = {
  getLastCommit
}
