import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  BookOpen,
  LoaderCircle,
  Search,
} from "lucide-react";

import { recommendationReferenceService } from "../services/recommendationReference.service.js";
import {
  courseBelongsToCareer,
  getEntityId,
  getEntityName,
  normalizeSearchText,
} from "../utils/recommendation.utils.js";

export function OfficialCourseSelector({
  careerId,
  selectedCourseId,
  disabled,
  onChange,
}) {
  const [courses, setCourses] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadCourses = async () => {
      if (!careerId) {
        setCourses([]);
        setError("");
        return;
      }

      setIsLoading(true);
      setError("");
      setCourses([]);
      setSearchValue("");
      onChange("");

      try {
        const items =
          await recommendationReferenceService.listCoursesByCareer(
            careerId,
            controller.signal,
          );

        const compatibleCourses = items.filter((course) =>
          courseBelongsToCareer(course, careerId),
        );

        setCourses(compatibleCourses);
      } catch (requestError) {
        if (
          requestError?.name === "CanceledError" ||
          requestError?.code === "ERR_CANCELED"
        ) {
          return;
        }

        setError(
          requestError?.response?.data?.message ||
            "No se pudieron cargar los cursos compatibles.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();

    return () => {
      controller.abort();
    };
  }, [careerId, onChange]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch =
      normalizeSearchText(searchValue);

    if (!normalizedSearch) {
      return courses;
    }

    return courses.filter((course) => {
      const values = [
        getEntityName(course),
        course?.code,
      ];

      return values.some((value) =>
        normalizeSearchText(value).includes(
          normalizedSearch,
        ),
      );
    });
  }, [courses, searchValue]);

  if (!careerId) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
        La recomendación no tiene una carrera válida.
      </div>
    );
  }

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">
          Buscar curso oficial
        </span>

        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        />

        <input
          type="search"
          value={searchValue}
          disabled={disabled || isLoading}
          placeholder="Buscar curso por nombre o código..."
          className="h-10 w-full rounded-xl border border-zinc-200 pl-10 pr-3 text-sm outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:bg-zinc-100"
          onChange={(event) =>
            setSearchValue(event.target.value)
          }
        />
      </label>

      {isLoading ? (
        <div
          role="status"
          className="mt-2 flex min-h-32 items-center justify-center rounded-xl border border-zinc-200"
        >
          <LoaderCircle
            aria-hidden="true"
            className="h-5 w-5 animate-spin text-upc-red"
          />

          <span className="ml-2 text-sm text-zinc-500">
            Cargando cursos...
          </span>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="mt-2 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
          />

          <p className="text-xs leading-5 text-red-700">
            {error}
          </p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-zinc-200 p-2">
          <div className="space-y-1">
            {filteredCourses.map((course) => {
              const courseId = getEntityId(course);
              const isSelected =
                selectedCourseId === courseId;

              return (
                <label
                  key={courseId}
                  className={[
                    "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5",
                    "transition-colors",
                    isSelected
                      ? "border-red-200 bg-red-50"
                      : "border-transparent hover:bg-zinc-50",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="officialCourse"
                    value={courseId}
                    checked={isSelected}
                    disabled={disabled}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-upc-red"
                    onChange={() => onChange(courseId)}
                  />

                  <BookOpen
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-upc-red"
                  />

                  <span className="min-w-0">
                    <span className="block break-words text-sm font-semibold text-zinc-800">
                      {getEntityName(course)}
                    </span>

                    {course?.code ? (
                      <span className="mt-0.5 block text-xs text-zinc-500">
                        Código: {course.code}
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
          No existen cursos compatibles con la carrera seleccionada.
        </div>
      )}
    </div>
  );
}
