export default {
  isLeader (role) {
    return role > 1
  },
  isAdmin (role) {
    return role < 0
  },
  roleMap: {
    '-1': 'Administrator',
    '0': 'Intern',
    '1': 'Team Member',
    '2': 'Team Leader'
  }
}
