"use client";

import { useState, useEffect } from "react";

interface SocialLinkForm {
  platform: "facebook" | "instagram" | "youtube" | "website";
  url: string;
  visibility: "everyone" | "followers" | "friends" | "hidden";
}

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [defaultRole, setDefaultRole] = useState<string>("hybrid");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [homeCityId, setHomeCityId] = useState<string | null>(null);
  const [homeCityName, setHomeCityName] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    fetch("/api/profiles/me")
      .then((r) => r.json())
      .then((data) => {
        setDisplayName(data.displayName ?? "");
        setBio(data.bio ?? "");
        setDefaultRole(data.defaultRole ?? "hybrid");
        setAvatarUrl(data.avatarUrl ?? "");
        setHomeCityId(data.homeCityId);
        setHomeCityName(data.homeCityName ?? null);
        setSocialLinks(
          data.socialLinks?.map((l: SocialLinkForm) => ({
            platform: l.platform,
            url: l.url,
            visibility: l.visibility,
          })) ?? [],
        );
        setLoading(false);
      });
  }, []);

  async function saveProfile() {
    setSaving(true);
    await fetch("/api/profiles/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, bio, defaultRole, avatarUrl, homeCityId }),
    });
    await fetch("/api/profiles/me/social-links", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ links: socialLinks }),
    });
    setSaving(false);
  }

  async function detectCity() {
    setDetecting(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject),
      );
      const res = await fetch("/api/profiles/me/detect-city", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      });
      const data = await res.json();
      if (data.cityId) {
        setHomeCityId(data.cityId);
        setHomeCityName(data.cityName);
      }
    } catch {
      // Geolocation denied or no city within range
    }
    setDetecting(false);
  }

  function updateLink(index: number, field: keyof SocialLinkForm, value: string) {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  }

  function addLink() {
    const used = new Set(socialLinks.map((l) => l.platform));
    const platforms = ["facebook", "instagram", "youtube", "website"] as const;
    const available = platforms.find((p) => !used.has(p));
    if (!available) return;
    setSocialLinks([...socialLinks, { platform: available, url: "", visibility: "everyone" }]);
  }

  function removeLink(index: number) {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  }

  if (loading) {
    return <div className="p-6 max-w-2xl mx-auto animate-pulse"><div className="h-8 bg-gray-200 rounded w-48 mb-4" /><div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded" />)}</div></div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full border rounded px-3 py-2" maxLength={255} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} maxLength={2000} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Default Role</label>
          <select value={defaultRole} onChange={(e) => setDefaultRole(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="base">Base</option>
            <option value="flyer">Flyer</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Avatar URL</label>
          <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Home City</label>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">{homeCityName ?? "Not set"}</span>
            <button onClick={detectCity} disabled={detecting} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 disabled:opacity-50" aria-label="Detect my city">
              {detecting ? "Detecting..." : "Auto-detect"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Social Links</label>
          {socialLinks.map((link, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <select value={link.platform} onChange={(e) => updateLink(i, "platform", e.target.value)} className="border rounded px-2 py-1" aria-label="Platform">
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="website">Website</option>
              </select>
              <input type="url" value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="URL" aria-label={`${link.platform} URL`} />
              <select value={link.visibility} onChange={(e) => updateLink(i, "visibility", e.target.value)} className="border rounded px-2 py-1" aria-label={`${link.platform} visibility`}>
                <option value="everyone">Everyone</option>
                <option value="followers">Followers</option>
                <option value="friends">Friends</option>
                <option value="hidden">Hidden</option>
              </select>
              <button onClick={() => removeLink(i)} className="text-red-500 hover:text-red-700" aria-label={`Remove ${link.platform} link`}>×</button>
            </div>
          ))}
          {socialLinks.length < 4 && (
            <button onClick={addLink} className="text-sm text-blue-600 hover:underline">+ Add link</button>
          )}
        </div>
      </div>

      <button onClick={saveProfile} disabled={saving} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
