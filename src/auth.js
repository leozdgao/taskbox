export default {
  isLeader (role) {
    return role > 1
  },
  isAdmin (role) {
    return role < 0
  }
}
