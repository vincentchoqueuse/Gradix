<script lang="ts">
    import TonalitySelect from '$lib/components/settings/TonalitySelect.svelte';
    import ModelSelect from '$lib/components/settings/ModelSelect.svelte';
    import { settingsState } from '$lib/stores/settings.svelte.js';
    import { tonalities } from '$lib/data/tonalities';
    import { RefreshCcw, FileUp } from '@lucide/svelte';

    let models = $state<{ name: string }[]>([]);
    let isLoading = $state(false);
    let error = $state<string | null>(null);
    let textarea: HTMLTextAreaElement;

    async function loadModels() {
        if (!settingsState.ollamaUrl) {
            error = "Veuillez entrer une URL valide";
            return;
        }
        error = null;
        try {
            const response = await fetch(`${settingsState.ollamaUrl}/api/tags`);
            if (!response.ok) throw new Error("Erreur lors de la récupération des modèles");
            models = await response.json().then((data) => data.models);
            settingsState.modelList = models
        } catch (err) {
            error = err.message;
        }
    }
</script>

<header class="custom-header">
  <div class="flex items-center gap-2">
    <div class="header-title">Settings</div>
  </div>
</header>

<main class="flex-1 overflow-y-auto px-12 py-2">
  <h2 class="text-3xl font-semibold py-10">Ollama Settings</h2>
  <div class="space-y-6">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-4">
        <label for="ollamaUrl" class="custom-label">URL</label>
        <div class="flex flex-1 gap-2">
          <input
            id="ollamaUrl"
            type="text"
            bind:value={settingsState.ollamaUrl}
            class="w-full custom-input"
            placeholder="http://localhost:11434"
          />
          <button
            onclick={loadModels}
            class="btn">
            <RefreshCcw class="h-4 mr-2" />
            Connect
          </button>
        </div>
      </div>
    </div>

    {#if settingsState.modelList.length > 0}
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-4">
        <label for="ollamaModel" class="custom-label">Modèle</label>
          <div class="relative flex-1">
            <ModelSelect />
          </div>
      </div>
    </div>
    {/if}

    <div class="flex flex-col gap-2">
      <div class="flex items-start gap-4">
        <label for="prompt" class="custom-label">Prompt</label>
        <textarea
          id="prompt"
          rows="8"
          bind:value={settingsState.prompt}
          class="custom-textarea"
        >
        </textarea>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-4">
        <label for="ollamaModel" class="w-32 font-semibold">Teacher Tonality</label>
        <div class="relative flex-1">
            <TonalitySelect />
        </div>
      </div>
    </div>
  </div>
</main>
