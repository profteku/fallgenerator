<template>
  <div class="log-viewer">
    <h2>Log-Datei Auswertung</h2>
    <div v-if="loading">Lade Logs...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
    <table v-if="logs.length > 0">
      <thead>
        <tr>
          <th>Zeitstempel</th>
          <th>Event</th>
          <th>Pfad</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(log, index) in logs" :key="index">
          <td>{{ new Date(log.timestamp).toLocaleString() }}</td>
          <td>{{ log.event_type }}</td>
          <td>{{ log.page_path }}</td>
          <td>{{ log.details }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LogViewer',
  data() {
    return {
      logs: [],
      loading: true,
      error: null
    }
  },
  async created() {
    try {
      const response = await fetch('/logfile.json'); 
      if (!response.ok) {
        throw new Error('Log-Datei konnte nicht geladen werden.');
      }
      this.logs = await response.json();
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>