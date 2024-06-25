"use client";

import { Primitive } from "@radix-ui/react-primitive";
import { type ElementRef, forwardRef, ComponentPropsWithoutRef } from "react";
import { useMessageContext } from "../../context/react/MessageContext";
import { useThreadContext } from "../../context/react/ThreadContext";
import { useCombinedStore } from "../../utils/combined/useCombinedStore";

type ActionBarRootElement = ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;

enum HideAndFloatStatus {
  Hidden = "hidden",
  Floating = "floating",
  Normal = "normal",
}

type UseActionBarFloatStatusProps = {
  hideWhenRunning?: boolean | undefined;
  autohide?: "always" | "not-last" | "never" | undefined;
  autohideFloat?: "always" | "single-branch" | "never" | undefined;
};

const useActionBarFloatStatus = ({
  hideWhenRunning,
  autohide,
  autohideFloat,
}: UseActionBarFloatStatusProps) => {
  const { useThread } = useThreadContext();
  const { useMessage, useMessageUtils } = useMessageContext();

  return useCombinedStore(
    [useThread, useMessage, useMessageUtils],
    (t, m, mu) => {
      if (hideWhenRunning && t.isRunning) return HideAndFloatStatus.Hidden;

      const autohideEnabled =
        autohide === "always" || (autohide === "not-last" && !m.isLast);

      // normal status
      if (!autohideEnabled) return HideAndFloatStatus.Normal;

      // hidden status
      if (!mu.isHovering) return HideAndFloatStatus.Hidden;

      // floating status
      if (
        autohideFloat === "always" ||
        (autohideFloat === "single-branch" && m.branches.length <= 1)
      )
        return HideAndFloatStatus.Floating;

      return HideAndFloatStatus.Normal;
    },
  );
};

export type ActionBarRootProps = PrimitiveDivProps &
  UseActionBarFloatStatusProps;

export const ActionBarRoot = forwardRef<
  ActionBarRootElement,
  ActionBarRootProps
>(({ hideWhenRunning, autohide, autohideFloat, ...rest }, ref) => {
  const hideAndfloatStatus = useActionBarFloatStatus({
    hideWhenRunning,
    autohide,
    autohideFloat,
  });

  if (hideAndfloatStatus === HideAndFloatStatus.Hidden) return null;

  return (
    <Primitive.div
      {...(hideAndfloatStatus === HideAndFloatStatus.Floating
        ? { "data-floating": "true" }
        : null)}
      {...rest}
      ref={ref}
    />
  );
});

ActionBarRoot.displayName = "ActionBarRoot";
