import { useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Linkedin, Github, Globe, Send } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import SectionHeading from "./SectionHeading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm, ValidationError } from "@formspree/react";

const ContactSection = () => {
  const { profile } = usePortfolio();
  const formId = import.meta.env.VITE_FORMSPREE_FORM_ID || "xzdjypqe";
  const [state, handleSubmit] = useForm(formId);
  const { toast } = useToast();

  useEffect(() => {
    if (state.succeeded) {
      toast({ title: "Message sent!", description: "Thank you for reaching out." });
    }
  }, [state.succeeded, toast]);

  useEffect(() => {
    const formErrors = state.errors?.getFormErrors() ?? [];
    if (formErrors.length > 0) {
      toast({
        title: "Message could not be sent",
        description: formErrors[0].message,
        variant: "destructive",
      });
    }
  }, [state.errors, toast]);

  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Get in Touch" title="Contact" />
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-muted-foreground font-body">
              Feel free to reach out for collaborations, freelance work, or just a chat about AI and technology.
            </p>
            <div className="space-y-4">
              {profile?.phone && (
                <a href={`tel:${profile.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body">
                  <Phone size={18} /> {profile.phone}
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body">
                  <Mail size={18} /> {profile.email}
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body">
                  <Linkedin size={18} /> LinkedIn
                </a>
              )}
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body">
                  <Github size={18} /> GitHub
                </a>
              )}
              {profile?.website && (
                <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body">
                  <Globe size={18} /> {profile.website}
                </a>
              )}
            </div>
          </motion.div>
          {state.succeeded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-surface p-6 flex items-center justify-center min-h-[280px]"
            >
              <p className="text-primary font-display text-lg">Thank you for reaching out! ✓</p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              data-formspree-form-id={formId}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card-surface p-6 space-y-4"
            >
              <div>
                <label htmlFor="name" className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Name</label>
                <Input id="name" name="name" required className="mt-1" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Email</label>
                <Input id="email" type="email" name="email" required className="mt-1" placeholder="your@email.com" />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>
              <div>
                <label htmlFor="message" className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Message</label>
                <Textarea id="message" name="message" required className="mt-1" rows={4} placeholder="Tell me about your project..." />
                <ValidationError prefix="Message" field="message" errors={state.errors} />
              </div>
              <ValidationError prefix="Form" errors={state.errors} className="text-sm text-destructive" />
              <Button type="submit" disabled={state.submitting} className="w-full glow-primary glow-primary-hover">
                <Send size={14} /> {state.submitting ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
