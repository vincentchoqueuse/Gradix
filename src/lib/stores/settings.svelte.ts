export let settingsState = $state({
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "",
  prompt: `Tu es un enseignant qui corrige un travail d'étudiant.
**Ta tâche** :
- *Objectif* : Corrige l'orthographe, la grammaire et la syntaxe du commentaire initial, sans en changer le sens, et en prenant en compte le contexte.
- *Format de sortie* : Retourne UNIQUEMENT le commentaire corrigé et enrichi, sans introduction ni explication. Reste très concis (1 ou 2 phrases).`,
  tonality: "neutre",
  tonalityDescription: "",
  modelList: []
});

