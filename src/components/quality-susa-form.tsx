
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, FileDown, Loader2, Printer, Download, X } from "lucide-react";
import { format } from "date-fns";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from 'next/navigation';
import AsianPaintsLogo from "./asian-paints-logo";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
  locationName: z.string().min(1, "Location is required."),
  department: z.string().min(1, "Department is required."),
  block: z.string().min(1, "Block is required."),
  areaFloor: z.string().min(1, "Area/Floor is required."),
  observerName: z.string().min(1, "Observer Name is required."),
  observerType: z.string().min(1, "Observer Type is required."),
  employeeId: z.string().min(1, "Employee ID is required."),
  designation: z.string().min(1, "Designation is required."),
  employeeDepartment: z.string().min(1, "Employee Department is required."),
  employeeBlock: z.string().min(1, "Employee Block is required."),
  taskActivityObserved: z.string().min(1, "Task/Activity is required."),
  noOfPeopleObserved: z.string().min(1, "Number of people is required."),
  shift: z.string().min(1, "Shift is required."),
  reactionsOfPeople: z.string().optional(),
  
  bodyPostureBending: z.boolean().default(false),
  bodyPostureTwisting: z.boolean().default(false),
  bodyPostureReaching: z.boolean().default(false),
  bodyPostureLifting: z.boolean().default(false),
  bodyPosturePushing: z.boolean().default(false),
  bodyPosturePulling: z.boolean().default(false),

  toolsAndEquipmentSelection: z.boolean().default(false),
  toolsAndEquipmentUse: z.boolean().default(false),
  toolsAndEquipmentCondition: z.boolean().default(false),

  ppeEyesAndFace: z.boolean().default(false),
  ppeHead: z.boolean().default(false),
  ppeHands: z.boolean().default(false),
  ppeRespiratory: z.boolean().default(false),
  ppeHearing: z.boolean().default(false),
  ppeFoot: z.boolean().default(false),
  ppeBody: z.boolean().default(false),

  procedureAvailability: z.boolean().default(false),
  procedureFollowing: z.boolean().default(false),
  procedureUnderstanding: z.boolean().default(false),
  
  safeActs: z.string().optional(),
  unsafeActs: z.string().optional(),
  otherObservations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const locations = ["Sriperumbudur", "Patancheru", "Khandala", "Rohtak", "Vizag", "Mysuru", "Kasna", "Ankleshwar", "Sripi"];
const departments = ["Production Department", "Quality Department", "Admin Department"];
const blocks = ["Manufacturing block", "RH House", "EH House", "SPB", "WPB"];
const floors = ["Charge hopper floor", "RH Reactor Floor", "EH Reactor Floor", "SPB Floor", "WPB Floor"];
const observers = ["VASANTH R", "Sai", "Manmohan", "Ashish", "Tanmay", "Aniket", "Shriyash"];
const observerTypes = ["APL Employee", "APG", "PPGAP", "APPPG"];
const employeeIds = ["00132461", "P00126717", "P00126718"];
const designations = ["EXECUTIVE I - PLANT ENGINEERING", "Executive I - Production", "Manager - Production"];
const employeeDepartments = ["ENGINEERING", "PRODUCTION", "QUALITY"];
const shifts = ["General Shift", "Shift A", "Shift B", "Shift C"];

const ppeItems = [
    { id: "ppeEyesAndFace", label: "Eyes & Face" },
    { id: "ppeHead", label: "Head" },
    { id: "ppeHands", label: "Hands" },
    { id: "ppeRespiratory", label: "Respiratory" },
    { id: "ppeHearing", label: "Hearing" },
    { id: "ppeFoot", label: "Foot" },
    { id: "ppeBody", label: "Body" },
] as const;


export default function QualitySusaForm() {
  const { toast } = useToast();
  const router = useRouter();
  const formRef = React.useRef<HTMLDivElement>(null);
  const qrCodeRef = React.useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [qrCodeValue, setQrCodeValue] = React.useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationName: "Sriperumbudur",
      department: "Production Department",
      block: "Manufacturing block",
      areaFloor: "Charge hopper floor",
      observerName: "VASANTH R",
      observerType: "APL Employee",
      employeeId: "00132461",
      designation: "EXECUTIVE I - PLANT ENGINEERING",
      employeeDepartment: "ENGINEERING",
      employeeBlock: "Manufacturing block",
      taskActivityObserved: "",
      noOfPeopleObserved: "1",
      shift: "General Shift",
      reactionsOfPeople: "",
      bodyPostureBending: false,
      bodyPostureTwisting: false,
      bodyPostureReaching: false,
      bodyPostureLifting: false,
      bodyPosturePushing: false,
      bodyPosturePulling: false,
      toolsAndEquipmentSelection: false,
      toolsAndEquipmentUse: false,
      toolsAndEquipmentCondition: false,
      ppeEyesAndFace: false,
      ppeHead: false,
      ppeHands: false,
      ppeRespiratory: false,
      ppeHearing: false,
      ppeFoot: false,
      ppeBody: false,
      procedureAvailability: false,
      procedureFollowing: false,
      procedureUnderstanding: false,
      safeActs: "",
      unsafeActs: "",
      otherObservations: ""
    },
  });

  const bbqReferenceNumber = `QUALITYSUSA${format(new Date(), 'yyyyMMddHHmmss')}`;

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    // Here you would typically send the data to your backend/database
    console.log({ bbqReferenceNumber, ...values });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    toast({
        title: 'Success!',
        description: `QUALITY SUSA has been raised with reference ID: ${bbqReferenceNumber}`,
    });
    form.reset();
  }

  const handleGenerateQrCode = () => {
    const values = form.getValues();
    const allValues = { bbqReferenceNumber, ...values };
    setQrCodeValue(JSON.stringify(allValues));
  };

  const handlePrintQrCode = () => {
    window.print();
  };

  const handleDownloadQrCode = async () => {
    const qrElement = qrCodeRef.current;
    if (!qrElement) return;

    try {
      const canvas = await html2canvas(qrElement, { scale: 2, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `quality-susa-qr-code.png`;
      link.click();
      toast({ title: "Success", description: "QR Code download has started." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "QR Code Download Error",
        description: "An error occurred while generating the QR Code image.",
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
      pdf.save(`quality-susa.pdf`);
      toast({ title: "Success", description: "PDF export has started." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "PDF Export Error",
        description: "An error occurred while generating the PDF.",
      });
    }
  };
  
  return (
    <>
      <Card ref={formRef} className="w-full shadow-2xl" id="quality-susa-form-card">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            {/* The main title is on the page, not in the card */}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronLeft />
              Back
            </Button>
            <Button variant="outline" onClick={handleGenerateQrCode}>
              <Printer />
              Print QR Code
            </Button>
            <Button variant="outline" onClick={handleExportPdf}>
              <FileDown />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Accordion type="multiple" className="w-full" defaultValue={["general-details", "observation-details"]}>
                <AccordionItem value="general-details">
                  <AccordionTrigger className="text-lg font-semibold">General Details</AccordionTrigger>
                  <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <FormItem>
                        <FormLabel>BBQ Reference Number</FormLabel>
                        <FormControl>
                          <Input disabled value={bbqReferenceNumber} />
                        </FormControl>
                        <FormDescription>(Auto Generated)</FormDescription>
                      </FormItem>
                      <FormField
                        control={form.control}
                        name="locationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Name</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a location" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the Department specifically from the list</FormDescription>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="block"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Block<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a block" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {blocks.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the Block specifically from the list</FormDescription>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="areaFloor"
                        render={({ field }) => (
                           <FormItem>
                            <FormLabel>Area / Floor<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an area/floor" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {floors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the Floor specifically from the list</FormDescription>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="observerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observer Name<span className="text-red-500">*</span></FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an observer" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {observers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="observerType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observer Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select observer type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {observerTypes.map(et => <SelectItem key={et} value={et}>{et}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                           <FormItem>
                            <FormLabel>Employee ID</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an employee ID" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {employeeIds.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Designation</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a designation" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {designations.map(id => <SelectItem key={id} value={id}>{id}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="employeeDepartment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employee Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {employeeDepartments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeBlock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employee Block</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a block" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {blocks.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the block specifically from the list</FormDescription>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="observation-details">
                    <AccordionTrigger className="text-lg font-semibold">Observation Details</AccordionTrigger>
                    <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField
                            control={form.control}
                            name="taskActivityObserved"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Task/Activity Observed<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                <Input placeholder="Enter the observed task" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="noOfPeopleObserved"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of People Observed<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="e.g., 1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="shift"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shift<span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select shift" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {shifts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="reactionsOfPeople"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reactions of People</FormLabel>
                                <FormControl>
                                    <Input placeholder="Note any reactions" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="body-posture">
                    <AccordionTrigger className="text-lg font-semibold">Body Posture, Tools & PPE</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                        <div>
                            <FormLabel className="text-base font-medium">Body Posture / Ergonomics</FormLabel>
                            <div className="p-4 mt-2 border rounded-md grid grid-cols-2 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="bodyPostureBending" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Bending</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="bodyPostureTwisting" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Twisting</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="bodyPostureReaching" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Reaching</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="bodyPostureLifting" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Lifting</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="bodyPosturePushing" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Pushing</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="bodyPosturePulling" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Pulling</FormLabel></FormItem>)} />
                            </div>
                        </div>
                        <div>
                            <FormLabel className="text-base font-medium">Tools and Equipment</FormLabel>
                            <div className="p-4 mt-2 border rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="toolsAndEquipmentSelection" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Selection</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="toolsAndEquipmentUse" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Use</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="toolsAndEquipmentCondition" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Condition</FormLabel></FormItem>)} />
                            </div>
                        </div>
                         <div>
                            <FormLabel className="text-base font-medium">Personal Protective Equipment (PPE)</FormLabel>
                            <div className="p-4 mt-2 border rounded-md grid grid-cols-2 md:grid-cols-3 gap-4">
                                {ppeItems.map(item => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name={item.id}
                                    render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                    )}
                                />
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="procedures-and-other-details" className="border-b-0">
                    <AccordionTrigger className="text-lg font-semibold">Procedures and Other Details</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                       <div>
                            <FormLabel className="text-base font-medium">Procedures</FormLabel>
                            <div className="p-4 mt-2 border rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="procedureAvailability" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Availability / Adequacy</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="procedureFollowing" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Following</FormLabel></FormItem>)} />
                                <FormField control={form.control} name="procedureUnderstanding" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Understanding</FormLabel></FormItem>)} />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="safeActs"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Safe Acts / Conditions</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Describe any safe acts or conditions observed..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unsafeActs"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Unsafe Acts / Conditions</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Describe any unsafe acts or conditions observed..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="otherObservations"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Other Observations</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Describe any other observations..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </AccordionContent>
                </AccordionItem>
              </Accordion>
              <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 pt-8 px-0">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Clear Form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Printer />}
                  Submit
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Dialog open={!!qrCodeValue} onOpenChange={(open) => !open && setQrCodeValue(null)}>
        <DialogContent className="sm:max-w-md p-0">
          <div className="bg-primary text-primary-foreground py-2 px-4 flex items-center justify-end gap-2">
            <Button variant="ghost" className="hover:bg-primary/80" onClick={handlePrintQrCode}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="ghost" className="hover:bg-primary/80" onClick={handleDownloadQrCode}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="hover:bg-primary/80">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <div className="p-6" ref={qrCodeRef}>
            <div className="flex items-center justify-center space-x-4 mb-4">
                <AsianPaintsLogo />
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg">
              {qrCodeValue && <QRCode value={qrCodeValue} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />}
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Scan Using Asian Paints EHS Mobile App
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

    