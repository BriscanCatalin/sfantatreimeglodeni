import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";

export const Route = createFileRoute("/admin/evenimente")({
  head: () => ({
    meta: [{ title: "Adaugă eveniment – O pâine pe zi" }],
  }),
  component: AdminEventsPage,
});

function AdminEventsPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessError, setAccessError] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/admin/api/session")
      .then(async (response) => {
        if (response.status === 401) return;
        if (!response.ok) {
          throw new Error("Nu s-a putut verifica sesiunea.");
        }
        const result = (await response.json()) as { authorized?: boolean };
        if (!result.authorized)
          throw new Error("Nu s-a putut confirma sesiunea.");
        if (active) setAuthorized(true);
      })
      .catch((error: unknown) => {
        if (active) {
          setAccessError(
            error instanceof Error
              ? error.message
              : "Nu s-a putut verifica dreptul de acces. Reîncarcă pagina.",
          );
        }
      })
      .finally(() => {
        if (active) setCheckingAccess(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccessError("");
    setLoggingIn(true);

    try {
      const response = await fetch("/admin/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Autentificarea nu a reușit.");
      }
      setPassword("");
      setAuthorized(true);
    } catch (error) {
      setAccessError(
        error instanceof Error ? error.message : "Autentificarea nu a reușit.",
      );
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    setAccessError("");
    try {
      const response = await fetch("/admin/api/logout", { method: "POST" });
      if (!response.ok) throw new Error("Nu s-a putut încheia sesiunea.");
      setAuthorized(false);
    } catch (error) {
      setAccessError(
        error instanceof Error
          ? error.message
          : "Nu s-a putut încheia sesiunea.",
      );
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setFormError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/admin/api/events", {
        method: "POST",
        body: new FormData(formElement),
      });
      const result = (await response.json()) as {
        error?: string;
        title?: string;
      };
      if (!response.ok) {
        if (response.status === 401) {
          setAuthorized(false);
          setAccessError("Sesiunea a expirat. Autentifică-te din nou.");
          return;
        }
        throw new Error(result.error ?? "Evenimentul nu a putut fi salvat.");
      }

      formElement.reset();
      setImagePreview(null);
      setSuccess(
        `Evenimentul „${result.title ?? "eveniment"}” a fost adăugat.`,
      );
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Evenimentul nu a putut fi salvat.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-secondary px-6 py-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/evenimente"
          className="text-sm text-primary underline underline-offset-4"
        >
          ← Înapoi la evenimente
        </Link>
        <h1 className="mt-6 font-serif text-4xl">Adaugă un eveniment</h1>
        <p className="mt-3 text-muted-foreground">
          Completează detaliile evenimentului. Publicarea este protejată cu
          parolă.
        </p>
        {import.meta.env.DEV && (
          <p className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
            Mod local de test: accesul este permis doar pe acest server local.
            În producție, parola trebuie configurată ca secret Worker.
          </p>
        )}

        {checkingAccess ? (
          <p className="mt-8" role="status">
            Se verifică dreptul de acces…
          </p>
        ) : !authorized ? (
          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5 rounded-lg border bg-card p-6 md:p-8"
          >
            <label className="block space-y-2 text-sm font-medium">
              Parola de administrator
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </label>
            {accessError && (
              <p role="alert" className="text-sm text-destructive">
                {accessError}
              </p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {loggingIn ? "Se verifică…" : "Autentifică-te"}
            </button>
          </form>
        ) : (
          <>
            {accessError && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {accessError}
              </p>
            )}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-primary underline underline-offset-4"
              >
                Ieși din cont
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="mt-4 space-y-6 rounded-lg border bg-card p-6 md:p-8"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  Titlul evenimentului
                  <input
                    name="title"
                    required
                    maxLength={120}
                    className="w-full rounded-md border bg-background px-3 py-2"
                    placeholder="Ex.: Rugul Aprins"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Organizator / grup
                  <input
                    name="organizer"
                    required
                    maxLength={120}
                    className="w-full rounded-md border bg-background px-3 py-2"
                    placeholder="Ex.: Grupul Rugul Aprins"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Data
                  <input
                    name="date"
                    type="date"
                    required
                    className="w-full rounded-md border bg-background px-3 py-2"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Ora
                  <input
                    name="time"
                    type="time"
                    required
                    className="w-full rounded-md border bg-background px-3 py-2"
                  />
                </label>
              </div>

              <label className="block space-y-2 text-sm font-medium">
                Locația
                <input
                  name="venue"
                  required
                  maxLength={200}
                  className="w-full rounded-md border bg-background px-3 py-2"
                  placeholder="Ex.: Palatul de Cultură din Glodeni"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium">
                Descriere
                <textarea
                  name="description"
                  required
                  maxLength={2000}
                  rows={4}
                  className="w-full rounded-md border bg-background px-3 py-2"
                  placeholder="Descrie pe scurt evenimentul"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium">
                Informații despre acces
                <input
                  name="entrance"
                  maxLength={100}
                  className="w-full rounded-md border bg-background px-3 py-2"
                  placeholder="Ex.: Intrare liberă"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium">
                Fotografie sau afiș (JPEG, PNG ori WebP, maximum 5 MB)
                <input
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="block w-full rounded-md border bg-background px-3 py-2 file:mr-4 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1"
                />
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Previzualizare fotografie eveniment"
                  className="max-h-80 w-full rounded-lg bg-muted object-contain"
                />
              )}

              {formError && (
                <p role="alert" className="text-sm text-destructive">
                  {formError}
                </p>
              )}
              {success && (
                <p role="status" className="text-sm text-primary">
                  {success}{" "}
                  <Link to="/evenimente" className="underline">
                    Vezi pagina de evenimente
                  </Link>
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Se salvează…" : "Publică evenimentul"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
