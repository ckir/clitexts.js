import * as _ from 'lodash-es'

const str = "The quick 🌷🎁💩\u001b[100m🏳️‍🌈😜👍brown \u001b[49m\u001b[31mfox jumped over \u001b[39mthe lazy \u001b[32mdog and then\u001b[39m\u001b[101m ran 💛 away with the unicorn.\u001b[49m"
const sz = _.size(str)
console.log(sz)