export default function ContactPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Get in touch with us for inquiries and collaborations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="font-semibold text-lg mb-2">Address</h3>
              <p className="text-muted-foreground">
                123 Architecture Street<br />
                City, State 12345
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Phone</h3>
              <p className="text-muted-foreground">+1 234 567 890</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p className="text-muted-foreground">info@atelier.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
