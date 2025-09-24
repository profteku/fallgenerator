<template>
  <div>
    <h2>Admin Login</h2>
    <input type="password" v-model="password" placeholder="Passwort eingeben" @keyup.enter="login">
    <button @click="login">Anmelden</button>
    <p v-if="error" style="color: red;">Falsches Passwort!</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: '',
      error: false
    }
  },
  methods: {
    login() {
      // Vergleiche das eingegebene Passwort mit deinem festgelegten Passwort
      if (this.password === 'Salz2wasser') { // ÄNDERE DIES!
        // Speichere den Login-Status, z.B. im localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');
        // Leite den Benutzer zum Admin-Dashboard weiter
        this.$router.push('/admin'); 
      } else {
        this.error = true;
      }
    }
  }
}
</script>