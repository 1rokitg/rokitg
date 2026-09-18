"use client";

import { IconButton } from "@once-ui-system/core";

interface TrackedCalendarButtonProps {
  href: string;
}

export default function TrackedCalendarButton({
  href,
}: TrackedCalendarButtonProps) {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.href = href;
  };

  return (
    <IconButton
      href={href}
      data-border="rounded"
      variant="secondary"
      icon="chevronRight"
      onClick={handleClick}
    />
  );
}
