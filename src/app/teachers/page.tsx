"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TeacherSummary {
  id: string;
  display_name: string;
  bio: string | null;
  specialties: string[];
  badge_status: string;
  aggregate_rating: number | null;
  review_count: number;
  city: string | null;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [badge, setBadge] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (specialty) params.set("specialty", specialty);
    if (badge) params.set("badge", badge);

    fetch(`/api/teachers?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setTeachers(data.teachers ?? []);
        setLoading(false);
      });
  }, [query, specialty, badge]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Teacher Directory</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search teachers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
        <select
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All statuses</option>
          <option value="verified">Verified</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending</option>
        </select>
        <input
          type="text"
          placeholder="Specialty..."
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : teachers.length === 0 ? (
        <p className="text-gray-500">No teachers found.</p>
      ) : (
        <div className="space-y-4">
          {teachers.map((t) => (
            <Link
              key={t.id}
              href={`/teachers/${t.id}`}
              className="block border rounded p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">{t.display_name}</h2>
                  {t.bio && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{t.bio}</p>
                  )}
                  {t.specialties.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {t.specialties.map((s) => (
                        <span
                          key={s}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      t.badge_status === "verified"
                        ? "bg-green-100 text-green-800"
                        : t.badge_status === "expired"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {t.badge_status}
                  </span>
                  {t.aggregate_rating && (
                    <p className="text-sm mt-1">
                      ★ {t.aggregate_rating.toFixed(1)} ({t.review_count})
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
