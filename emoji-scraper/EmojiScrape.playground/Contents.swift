import UIKit
import Foundation

let url = Bundle.main.url(forResource: "AppleName", withExtension: "strings", subdirectory: "en.lproj")
let dict = NSDictionary.init(contentsOf: url!)

for (key, value) in dict! {
    print(key, value)
}
