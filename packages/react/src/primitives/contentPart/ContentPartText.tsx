import { Primitive } from "@radix-ui/react-primitive";
import { type ElementRef, forwardRef, ComponentPropsWithoutRef } from "react";
import { useContentPartText } from "../../primitive-hooks/contentPart/useContentPartText";

type ContentPartTextElement = ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = ComponentPropsWithoutRef<typeof Primitive.span>;

type ContentPartTextProps = Omit<PrimitiveSpanProps, "children">;

export const ContentPartText = forwardRef<
  ContentPartTextElement,
  ContentPartTextProps
>((props, forwardedRef) => {
  const text = useContentPartText();

  return (
    <Primitive.span {...props} ref={forwardedRef}>
      {text}
    </Primitive.span>
  );
});

ContentPartText.displayName = "ContentPartText";
