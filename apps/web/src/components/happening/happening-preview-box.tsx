import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale/nb";

import { type AllHappeningsQueryResult } from "@echo-webkom/cms/types";
import { urlFor } from "@echo-webkom/sanity";

import { cn } from "@/utils/cn";
import { shortDateNoTimeWithEndDate } from "@/utils/date";

type CombinedHappeningPreviewProps = {
  happening: AllHappeningsQueryResult[number];
};

export const CombinedHappeningPreview = ({ happening }: CombinedHappeningPreviewProps) => {
  const parentPath = happening.happeningType === "bedpres" ? "bedpres" : "arrangement";

  return (
    <Link href={`/${parentPath}/${happening.slug}`}>
      <div
        className={cn(
          "flex h-full items-center justify-between gap-5 rounded-md p-5",
          "hover:bg-muted",
        )}
      >
        <div className="overflow-x-hidden">
          <h3 className="line-clamp-1 text-2xl font-semibold">{happening.title}</h3>
          <ul>
            {happening.happeningType === "event" && happening.organizers?.length && (
              <li>
                <span className="font-semibold">Gruppe:</span>{" "}
                {happening.organizers.map((o) => o.name).join(", ")}
              </li>
            )}
            {happening.date && (
              <li>
                <span className="font-semibold">Dato:</span>{" "}
                {shortDateNoTimeWithEndDate(happening.date, happening.endDate ?? undefined)}
              </li>
            )}
            {happening.registrationStart && (
              <li>
                <span className="font-semibold">Påmelding:</span>{" "}
                {format(new Date(happening.registrationStart), "d. MMMM yyyy", {
                  locale: nb,
                })}
              </li>
            )}
          </ul>
        </div>
        {happening.happeningType === "bedpres" && (
          <div className="hidden overflow-hidden rounded-full border sm:block">
            <div className="relative aspect-square h-20 w-20">
              {happening.company && (
                <Image
                  src={urlFor(happening.company.image).url()}
                  alt={`${happening.company.name} logo`}
                  fill
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};
