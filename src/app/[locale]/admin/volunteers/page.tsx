import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getDistrict } from "@/lib/districts";
import { Card } from "@/components/ui/Card";
import { SKILL_LABELS, type TaskStatus, type ApplicationStatus, type Skill } from "@/lib/volunteers";
import { TaskForm } from "./TaskForm";
import { CloseTaskButton } from "./CloseTaskButton";
import { ApplicationControls } from "./ApplicationControls";

interface TaskRow {
  id: string;
  title: string;
  description: string;
  required_skills: Skill[];
  slots: number;
  location: string;
  district_code: string;
  status: TaskStatus;
}

interface ApplicationRow {
  id: string;
  task_id: string;
  volunteer_id: string;
  status: ApplicationStatus;
  note: string | null;
  volunteers: { skills: Skill[]; availability: string } | null;
}

export default async function AdminVolunteersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const tVol = await getTranslations("volunteer");
  const supabase = await createClient();

  const [{ data: tasksData }, { data: applicationsData }] = await Promise.all([
    supabase
      .from("volunteer_tasks")
      .select("id, title, description, required_skills, slots, location, district_code, status")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("task_applications")
      .select("id, task_id, volunteer_id, status, note, volunteers(skills, availability)")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const tasks = (tasksData ?? []) as TaskRow[];
  const applicationsByTask = new Map<string, ApplicationRow[]>();
  for (const a of (applicationsData ?? []) as unknown as ApplicationRow[]) {
    const list = applicationsByTask.get(a.task_id) ?? [];
    list.push(a);
    applicationsByTask.set(a.task_id, list);
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-bold">{t("volunteers.newTask")}</h2>
        <div className="mt-4">
          <TaskForm locale={locale} />
        </div>
      </Card>

      <section>
        <h2 className="text-xl font-bold">{t("volunteers.existingTasks")}</h2>
        <ul className="mt-4 space-y-4">
          {tasks.map((task) => {
            const district = getDistrict(task.district_code);
            const applications = applicationsByTask.get(task.id) ?? [];
            const accepted = applications.filter((a) => a.status === "accepted").length;
            return (
              <li key={task.id}>
                <Card className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{task.title}</p>
                      <p className="text-sm text-ink-2">
                        {district ? (locale === "bn" ? district.name.bn : district.name.en) : task.district_code} ·{" "}
                        {t(`volunteers.taskStatus.${task.status}`)} ·{" "}
                        {t("volunteers.slotsFilled", { filled: accepted, total: task.slots })}
                      </p>
                    </div>
                    {task.status === "open" && <CloseTaskButton locale={locale} id={task.id} />}
                  </div>

                  {applications.length > 0 && (
                    <ul className="mt-3 space-y-2 border-t border-border pt-3">
                      {applications.map((a) => (
                        <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span>
                            {(a.volunteers?.skills ?? []).map((s) => (locale === "bn" ? SKILL_LABELS[s].bn : SKILL_LABELS[s].en)).join(", ") ||
                              t("volunteers.noSkillsListed")}{" "}
                            · <span className="font-semibold">{tVol(`applicationStatus.${a.status}`)}</span>
                            {a.note && <span className="text-ink-3"> — {a.note}</span>}
                          </span>
                          {a.status === "applied" && <ApplicationControls locale={locale} applicationId={a.id} />}
                        </li>
                      ))}
                    </ul>
                  )}
                  {applications.length === 0 && <p className="mt-3 text-sm text-ink-3">{t("volunteers.noApplications")}</p>}
                </Card>
              </li>
            );
          })}
          {tasks.length === 0 && <p className="text-ink-2">{t("volunteers.noneYet")}</p>}
        </ul>
      </section>
    </div>
  );
}
