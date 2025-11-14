
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, FileDown, Loader2, QrCode, Save, Sparkles } from "lucide-react";
import { format } from "date-fns";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getHarpSuggestions } from "@/app/actions";
import { useDebounce } from "@/hooks/use-debounce";

const formSchema = z.object({
  harpId: z.string().min(1, "HARP ID is required"),
  date: z.date({ required_error: "A date is required." }),
  location: z.string().optional(),
  department: z.string().optional(),
  block: z.string().optional(),
  floor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function HarpForm() {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [qrCodeValue, setQrCodeValue] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      harpId: "",
      location: "",
      department: "",
      block: "",
      floor: "",
    },
  });

  const watchedFields = form.watch();
  const debouncedSuggestionQuery = useDebounce({
      partialLocation: watchedFields.location,
      partialDepartment: watchedFields.department,
      partialBlock: watchedFields.block,
      partialFloor: watchedFields.floor
  }, 500);

  React.useEffect(() => {
    const { partialLocation, partialDepartment, partialBlock, partialFloor } = debouncedSuggestionQuery;
    if (partialLocation || partialDepartment || partialBlock || partialFloor) {
      setIsSuggesting(true);
      getHarpSuggestions(debouncedSuggestionQuery)
        .then((res) => {
          if (res.success && res.data) {
            const { suggestedLocation, suggestedDepartment, suggestedBlock, suggestedFloor } = res.data;
            if (suggestedLocation && !form.getValues('location')) form.setValue('location', suggestedLocation, { shouldValidate: true });
            if (suggestedDepartment && !form.getValues('department')) form.setValue('department', suggestedDepartment, { shouldValidate: true });
            if (suggestedBlock && !form.getValues('block')) form.setValue('block', suggestedBlock, { shouldValidate: true });
            if (suggestedFloor && !form.getValues('floor')) form.setValue('floor', suggestedFloor, { shouldValidate: true });
          }
        })
        .catch(() => {
          toast({ variant: "destructive", title: "Suggestion Error", description: "Could not fetch AI suggestions." });
        })
        .finally(() => {
          setIsSuggesting(false);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSuggestionQuery, form.setValue, form.getValues]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    console.log(values);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast({
      title: "Success!",
      description: "HARP data has been saved.",
    });
  }

  const handleGenerateQrCode = () => {
    const values = form.getValues();
    const valid = formSchema.safeParse(values);
    if (valid.success) {
      setQrCodeValue(JSON.stringify(values));
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Data",
        description: "Please fill in all required fields before generating a QR code.",
      });
    }
  };

  const handleExportPdf = async () => {
    const formElement = formRef.current;
    if (!formElement) return;

    try {
      const canvas = await html2canvas(formElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`harp-insight-${form.getValues("harpId") || 'export'}.pdf`);
      toast({ title: "Success", description: "PDF export has started." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "PDF Export Error",
        description: "An error occurred while generating the PDF.",
      });
    }
  };
  
  const AiSparkle = isSuggesting ? Loader2 : Sparkles;

  return (
    <>
      <Card ref={formRef} className="w-full shadow-2xl" id="harp-form-card">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">HARP Details</CardTitle>
          <CardDescription>
            Fill in the form to record a new HARP entry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Accordion type="multiple" defaultValue={['general-details']} className="w-full">
                <AccordionItem value="general-details">
                  <AccordionTrigger className="text-lg font-semibold">General Details</AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-8">
                      <FormField
                        control={form.control}
                        name="harpId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>HARP ID</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., HID-12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="harp-details">
                  <AccordionTrigger className="text-lg font-semibold">HARP Details</AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-8">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              Location
                              <AiSparkle className={cn("h-4 w-4 text-primary", isSuggesting && "animate-spin")}/>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Main Hospital" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              Department
                              <AiSparkle className={cn("h-4 w-4 text-primary", isSuggesting && "animate-spin")}/>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Cardiology" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="block"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              Block
                              <AiSparkle className={cn("h-4 w-4 text-primary", isSuggesting && "animate-spin")}/>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="floor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              Floor
                              <AiSparkle className={cn("h-4 w-4 text-primary", isSuggesting && "animate-spin")}/>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 4" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="other-details">
                  <AccordionTrigger className="text-lg font-semibold">Other Details</AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <p className="text-muted-foreground">Additional details can be added here in the future.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGenerateQrCode}>
              <QrCode />
              Generate QR Code
            </Button>
            <Button variant="outline" onClick={handleExportPdf}>
              <FileDown />
              Export as PDF
            </Button>
          </div>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
            Save HARP Data
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={!!qrCodeValue} onOpenChange={(open) => !open && setQrCodeValue(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">HARP Data QR Code</DialogTitle>
            <DialogDescription>
              Scan this code to easily access or share the HARP details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-white rounded-lg">
            {qrCodeValue && <QRCode value={qrCodeValue} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
